using MTA.ENTITY.NV;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace MTA.SERVICE.NV
{
    public interface IDmTinTucService : IDataInfoService<Dm_TinTuc>
    {
    }

    public class DmTinTucService : DataInfoServiceBase<Dm_TinTuc>, IDmTinTucService
    {
        public DmTinTucService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
}
