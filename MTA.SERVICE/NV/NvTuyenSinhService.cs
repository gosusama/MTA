using MTA.ENTITY.NV;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.SERVICE.NV
{
    public interface INvTuyenSinhService : IDataInfoService<Dm_TuyenSinh>
    {

    }
    public class NvTuyenSinhService : DataInfoServiceBase<Dm_TuyenSinh>, INvTuyenSinhService
    {
        public NvTuyenSinhService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
