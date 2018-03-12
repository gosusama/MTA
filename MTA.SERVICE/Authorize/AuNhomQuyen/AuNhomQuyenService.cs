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

namespace MTA.SERVICE.Authorize.AuNhomQuyen
{
    public interface IAuNhomQuyenService : IDataInfoService<AU_NHOMQUYEN>
    {
        
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
    }
}
