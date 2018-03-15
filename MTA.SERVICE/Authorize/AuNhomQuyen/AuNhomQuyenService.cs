using System;
using System.Collections.Generic;
using System.Data;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Configuration;
using MTA.SERVICE.Services;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Helper;
using BTS.API.SERVICE.Helper;
using System.Data.SqlClient;
using MTA.ENTITY;

namespace MTA.SERVICE.Authorize.AuNhomQuyen
{
    public interface IAuNhomQuyenService : IDataInfoService<AU_NHOMQUYEN>
    {
        Task<TransferObj<List<ChoiceObj>>> GetNhomQuyenConfigByUsername(string phanhe, string username);
    }
    public class AuNhomQuyenService : DataInfoServiceBase<AU_NHOMQUYEN>, IAuNhomQuyenService
    {
        public AuNhomQuyenService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
        protected override Expression<Func<AU_NHOMQUYEN, bool>> GetKeyFilter(AU_NHOMQUYEN instance)
        {
            return x => x.MANHOMQUYEN == instance.MANHOMQUYEN;
        }
        public async Task<TransferObj<List<ChoiceObj>>> GetNhomQuyenConfigByUsername(string phanhe, string username)
        {
            TransferObj<List<ChoiceObj>> response = new TransferObj<List<ChoiceObj>>();
            try
            {
                using (var connection = new SqlConnection(new MTADbContext().Database.Connection.ConnectionString))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandType = CommandType.Text;
                        command.CommandText =
                            @"SELECT MANHOMQUYEN,TENNHOMQUYEN FROM AU_NHOMQUYEN WHERE TRANGTHAI=10 AND UNITCODE='" + phanhe + "' AND MANHOMQUYEN NOT IN(SELECT MANHOMQUYEN FROM AU_NGUOIDUNG_NHOMQUYEN WHERE AU_NGUOIDUNG_NHOMQUYEN.UNITCODE='" + phanhe + "' AND AU_NGUOIDUNG_NHOMQUYEN.USERNAME='" + username + "')";
                        using (SqlDataReader sqlDataReader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection))
                        {
                            if (!sqlDataReader.HasRows) return new TransferObj<List<ChoiceObj>>()
                            {
                                Status = false,
                                Data = new List<ChoiceObj>()
                            };
                            List<ChoiceObj> lst = new List<ChoiceObj>();
                            while (sqlDataReader.Read())
                            {
                                lst.Add(new ChoiceObj()
                                {
                                    Text = sqlDataReader["TENNHOMQUYEN"].ToString(),
                                    Value = sqlDataReader["MANHOMQUYEN"].ToString(),
                                    Selected = false
                                });
                            }
                            response.Status = true;
                            response.Data = lst;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = ex.Message;
            }
            return response;
        }
    }
}
