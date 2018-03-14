using MTA.ENTITY;
using MTA.ENTITY.Authorize;
using MTA.SERVICE;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq.Expressions;

namespace MTA.SERVICE.Authorize.AuMenu
{
    public interface IAuMenuService : IDataInfoService<AU_MENU>
    {
        //List<AU_MENU> GetAllForStarting(string username, string unitCode);
        List<AU_MENU> GetAllForConfigNhomQuyen(string manhomquyen, string unitCode);
        List<AU_MENU> GetAllForConfigQuyen(string username, string unitCode);
    }
    public class AuMenuService : DataInfoServiceBase<AU_MENU>, IAuMenuService
    {
        public AuMenuService(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }
        protected override Expression<Func<AU_MENU, bool>> GetKeyFilter(AU_MENU instance)
        {
            return x => x.MenuId == instance.MenuId;
        }
        public List<AU_MENU> GetAllForConfigNhomQuyen(string manhomquyen, string unitCode)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(new MTADbContext().Database.Connection.ConnectionString))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandType = CommandType.Text;
                        command.CommandText = @"SELECT B.MENUID, B.MENUIDCHA, B.TITLE,B.SORT FROM AU_MENU B WHERE B.TRANGTHAI = 10 AND B.MENUID 
                                                NOT IN (SELECT A.MACHUCNANG FROM AU_NHOMQUYEN_CHUCNANG A WHERE A.UNITCODE='" + unitCode + "' AND A.MANHOMQUYEN='" + manhomquyen + "') AND B.UNITCODE='" + unitCode + "' AND B.MENUID IS NOT NULL ORDER BY B.SORT";
                        using (SqlDataReader oracleDataReader = command.ExecuteReader(CommandBehavior.CloseConnection))
                        {
                            if (!oracleDataReader.HasRows) return null;
                            List<AU_MENU> lst = new List<AU_MENU>();
                            while (oracleDataReader.Read())
                            {
                                AU_MENU item = new AU_MENU();
                                item.MenuId = oracleDataReader["MENUID"].ToString();
                                item.Sort = int.Parse(oracleDataReader["SORT"].ToString());
                                item.MenuIdCha = oracleDataReader["MENUIDCHA"].ToString();
                                item.Title = oracleDataReader["TITLE"].ToString();
                                lst.Add(item);
                            }
                            return lst;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public List<AU_MENU> GetAllForConfigQuyen(string username, string unitCode)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(new MTADbContext().Database.Connection.ConnectionString))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandType = CommandType.Text;
                        command.CommandText = @"SELECT SYSCHUCNANG.MENUID,SYSCHUCNANG.TITLE,SYSCHUCNANG.SORT,SYSCHUCNANG.MENUIDCHA FROM AU_MENU SYSCHUCNANG 
                                                WHERE SYSCHUCNANG.TRANGTHAI =10 AND UNITCODE='" + unitCode + "' AND MENUID IS NOT NULL AND SYSCHUCNANG.MENUID NOT IN(SELECT MACHUCNANG FROM AU_NGUOIDUNG_QUYEN WHERE AU_NGUOIDUNG_QUYEN.UNITCODE='" + unitCode + "' AND AU_NGUOIDUNG_QUYEN.USERNAME='" + username + "') ORDER BY SYSCHUCNANG.SORT";

                        using (SqlDataReader oracleDataReader =
                            command.ExecuteReader(CommandBehavior.CloseConnection))
                        {
                            if (!oracleDataReader.HasRows) return null;
                            List<AU_MENU> lst = new List<AU_MENU>();
                            while (oracleDataReader.Read())
                            {
                                AU_MENU item = new AU_MENU();
                                item.MenuId = oracleDataReader["MENUID"].ToString();
                                item.Sort = int.Parse(oracleDataReader["SORT"].ToString());
                                item.MenuIdCha = oracleDataReader["MENUIDCHA"].ToString();
                                item.Title = oracleDataReader["TITLE"].ToString();
                                lst.Add(item);
                            }
                            return lst;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        
    }
}
