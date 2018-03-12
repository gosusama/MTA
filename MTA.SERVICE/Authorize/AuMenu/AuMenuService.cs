using MTA.ENTITY;
using MTA.ENTITY.Authorize;
using MTA.SERVICE;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq.Expressions;

namespace MTA.SERVICE.Authorize.AuMenu
{
    public interface IAuMenuService : IDataInfoService<AU_MENU>
    {
        //List<AU_MENU> GetAllForStarting(string username, string unitCode);
    }
    public class AuMenuService : DataInfoServiceBase<AU_MENU>, IAuMenuService
    {
        public AuMenuService(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }
       
    }
}
