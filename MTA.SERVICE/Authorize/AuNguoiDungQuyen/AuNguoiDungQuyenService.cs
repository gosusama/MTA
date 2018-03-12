using MTA.ENTITY.Authorize;
using MTA.SERVICE;
using MTA.SERVICE.Services;

namespace BTS.API.SERVICE.Authorize.AuNguoiDungQuyen
{
    public interface IAuNguoiDungQuyenService : IDataInfoService<AU_NGUOIDUNG_QUYEN>
    {
    }
    public class AuNguoiDungQuyenService: DataInfoServiceBase<AU_NGUOIDUNG_QUYEN>, IAuNguoiDungQuyenService
    {
        public AuNguoiDungQuyenService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
