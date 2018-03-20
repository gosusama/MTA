using MTA.ENTITY.NV;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.SERVICE.DM
{
    public interface IDmNghienCuuService : IDataInfoService<Dm_NghienCuu>
    {

    }
    public class DmNghienCuuService : DataInfoServiceBase<Dm_NghienCuu>, IDmNghienCuuService
    {
        public DmNghienCuuService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
