using BTS.API.SERVICE.Helper;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
namespace MTA.SERVICE.Authorize.AuDonVi
{
    public interface IAuDonViService : IDataInfoService<AU_DONVI>
    {
        //string BuildCode();
        //string BuildCodeByParent(string parent);
        //string SaveCodeByParent(string parent);
        //string SaveCode();
        //List<ChoiceObj> GetSelectSort();
    }
    public class AuDonViService : DataInfoServiceBase<AU_DONVI>, IAuDonViService
    {
        public AuDonViService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
