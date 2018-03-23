using MTA.ENTITY.NV;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.SERVICE.DM
{
    public interface IDmLoaiTinTucService : IDataInfoService<Dm_LoaiTinTuc>
    {
    }

    public class DmLoaiTinTucService : DataInfoServiceBase<Dm_LoaiTinTuc>, IDmLoaiTinTucService
    {
        public DmLoaiTinTucService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
}
