using MTA.ENTITY.NV;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.SERVICE.DM
{
    public interface IDmLoaiDaoTaoService : IDataInfoService<Dm_LoaiDaoTao>
    {
    }

    public class DmLoaiDaoTaoService : DataInfoServiceBase<Dm_LoaiDaoTao>, IDmLoaiDaoTaoService
    {
        public DmLoaiDaoTaoService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
}