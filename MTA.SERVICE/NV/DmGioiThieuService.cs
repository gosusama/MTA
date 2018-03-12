using MTA.ENTITY.NV;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.SERVICE.NV
{
    public interface IDmGioiThieuService : IDataInfoService<Dm_GioiThieu>
    {

    }

    public class DmGioiThieuService : DataInfoServiceBase<Dm_GioiThieu>, IDmGioiThieuService
    {
        public DmGioiThieuService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
}