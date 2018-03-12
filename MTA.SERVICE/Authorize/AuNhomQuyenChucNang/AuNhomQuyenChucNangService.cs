using MTA.ENTITY.Authorize;
using MTA.SERVICE;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Data;

namespace MTA.SERVICE.Authorize.AuNhomQuyenChucNang
{
    public interface IAuNhomQuyenChucNangService : IDataInfoService<AU_NHOMQUYEN_CHUCNANG>
    {
    }
    public class AuNhomQuyenChucNangService: DataInfoServiceBase<AU_NHOMQUYEN_CHUCNANG>, IAuNhomQuyenChucNangService
    {
        public AuNhomQuyenChucNangService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
