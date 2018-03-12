using MTA.ENTITY.Authorize;
using MTA.SERVICE;
using MTA.SERVICE.Services;

namespace MTA.SERVICE.Authorize.AuNguoiDungNhomQuyen
{
    public interface IAuNguoiDungNhomQuyenService : IDataInfoService<AU_NGUOIDUNG_NHOMQUYEN>
    {
    }
    public class AuNguoiDungNhomQuyenService : DataInfoServiceBase<AU_NGUOIDUNG_NHOMQUYEN>, IAuNguoiDungNhomQuyenService
    {
        public AuNguoiDungNhomQuyenService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

    }
}
