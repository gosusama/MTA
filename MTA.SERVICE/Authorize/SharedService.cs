using BTS.API.SERVICE.Helper;
using MTA.ENTITY;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Helper;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace MTA.SERVICE.Authorize
{
    public interface ISharedService : IDataInfoService<AU_MENU>
    {
        RoleState GetRoleStateByMaChucNang(string unitCode, string username, string machucnang);
    }
    public class SharedService : DataInfoServiceBase<AU_MENU>, ISharedService
    {
        public SharedService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        protected override Expression<Func<AU_MENU, bool>> GetKeyFilter(AU_MENU instance)
        {
            return x => x.MenuId == instance.MenuId;
        }
        public RoleState GetRoleStateByMaChucNang(string unitCode, string username, string machucnang)
        {
            RoleState roleState = new RoleState();
            roleState.STATE = machucnang;
            //var cacheData = MemoryCacheHelper.GetValue(unitCode+"|"+machucnang + "|" + username);
            //if (cacheData==null)
            //{

            //}
            //else
            //{
            //    roleState = (RoleState)cacheData;

            //}
            if (username == "admin")
            {
                roleState = new RoleState()
                {
                    STATE = machucnang,
                    View = true,
                    Approve = true,
                    Delete = true,
                    Add = true,
                    Edit = true
                };
            }
            else
            {
                using (var connection = new SqlConnection(new MTADbContext().Database.Connection.ConnectionString))
                {
                    connection.Open();
                    using (SqlCommand command = connection.CreateCommand())
                    {
                        command.CommandType = CommandType.Text;
                        command.CommandText =
                            @"SELECT XEM,THEM,SUA,XOA,DUYET FROM AU_NHOMQUYEN_CHUCNANG WHERE UNITCODE='" + unitCode + "' AND MACHUCNANG='" + machucnang +
                            "' AND MANHOMQUYEN IN (SELECT MANHOMQUYEN FROM AU_NGUOIDUNG_NHOMQUYEN WHERE UNITCODE='" + unitCode + "' AND USERNAME='" +
                            username + "') UNION SELECT AU_NGUOIDUNG_QUYEN.XEM,AU_NGUOIDUNG_QUYEN.THEM,AU_NGUOIDUNG_QUYEN.SUA,AU_NGUOIDUNG_QUYEN.XOA,AU_NGUOIDUNG_QUYEN.DUYET " +
                            "FROM AU_NGUOIDUNG_QUYEN WHERE AU_NGUOIDUNG_QUYEN.UNITCODE='" + unitCode + "' AND AU_NGUOIDUNG_QUYEN.MACHUCNANG='" + machucnang + "' AND AU_NGUOIDUNG_QUYEN.USERNAME='" + username + "'";
                        using (SqlDataReader sqlReader = command.ExecuteReader())
                        {
                            if (!sqlReader.HasRows)
                            {
                                roleState = new RoleState()
                                {
                                    STATE = string.Empty,
                                    View = false,
                                    Approve = false,
                                    Delete = false,
                                    Add = false,
                                    Edit = false
                                };
                            }

                            else
                            {
                                roleState.STATE = machucnang;
                                while (sqlReader.Read())
                                {
                                    int objXem = Int32.Parse(sqlReader["XEM"].ToString());
                                    if (objXem == 1)
                                    {
                                        roleState.View = true;
                                    }
                                    int objThem = Int32.Parse(sqlReader["THEM"].ToString());
                                    if (objThem == 1)
                                    {
                                        roleState.Add = true;
                                    }
                                    int objSua = Int32.Parse(sqlReader["SUA"].ToString());
                                    if (objSua == 1)
                                    {
                                        roleState.Edit = true;
                                    }
                                    int objXoa = Int32.Parse(sqlReader["XOA"].ToString());
                                    if (objXoa == 1)
                                    {
                                        roleState.Delete = true;
                                    }
                                    int objDuyet = Int32.Parse(sqlReader["DUYET"].ToString());
                                    if (objDuyet == 1)
                                    {
                                        roleState.Approve = true;
                                    }
                                }
                                MemoryCacheHelper.Add(unitCode + "|" + machucnang + "|" + username, roleState,
                                    DateTimeOffset.Now.AddHours(6));
                            }
                        }
                    }
                }
            }
            return roleState;
        }
    }
}
