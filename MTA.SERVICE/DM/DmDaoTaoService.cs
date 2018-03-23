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
    public interface IDmDaoTaoService : IDataInfoService<Dm_DaoTao>
    {
    }

    public class DmDaoTaoService : DataInfoServiceBase<Dm_DaoTao>, IDmDaoTaoService
    {
        public DmDaoTaoService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
}
