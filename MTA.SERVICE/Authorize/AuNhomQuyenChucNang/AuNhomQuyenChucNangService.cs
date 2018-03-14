using MTA.ENTITY;
using MTA.ENTITY.Authorize;
using MTA.SERVICE;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;


namespace MTA.SERVICE.Authorize.AuNhomQuyenChucNang
{
    public interface IAuNhomQuyenChucNangService : IDataInfoService<AU_NHOMQUYEN_CHUCNANG>
    {
        List<AuNhomQuyenChucNangVm.ViewModel> GetByMaNhomQuyen(string phanhe, string manhomquyen);
    }
    public class AuNhomQuyenChucNangService: DataInfoServiceBase<AU_NHOMQUYEN_CHUCNANG>, IAuNhomQuyenChucNangService
    {
        public AuNhomQuyenChucNangService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
        public List<AuNhomQuyenChucNangVm.ViewModel> GetByMaNhomQuyen(string phanhe, string manhomquyen)
        {
            try
            {
                MTADbContext db = new MTADbContext();
                var data = (from cn in db.AU_NHOMQUYEN_CHUCNANGs
                            join mn in db.AU_MENUs on cn.MACHUCNANG equals mn.MenuId
                            where cn.UnitCode==phanhe && mn.UnitCode == phanhe && cn.MANHOMQUYEN == manhomquyen
                            orderby mn.Sort
                            select new
                            {
                                ID = cn.Id,
                                MANHOMQUYEN = cn.MANHOMQUYEN,
                                MACHUCNANG = cn.MACHUCNANG,
                                TENCHUCNANG = mn.Title,
                                STATE = mn.MenuId,
                                SOTHUTU = mn.Sort,
                                XEM = cn.XEM,
                                SUA = cn.SUA,
                                XOA = cn.XOA,
                                THEM = cn.THEM,
                                DUYET = cn.DUYET,
                            }).ToList();
                List<AuNhomQuyenChucNangVm.ViewModel> lst = new List<AuNhomQuyenChucNangVm.ViewModel>();
                foreach(var x in data)
                {
                    AuNhomQuyenChucNangVm.ViewModel temp = new AuNhomQuyenChucNangVm.ViewModel()
                    {
                        Id = x.ID,
                        MANHOMQUYEN = x.MANHOMQUYEN,
                        MACHUCNANG = x.MACHUCNANG,
                        TENCHUCNANG = x.TENCHUCNANG,
                        STATE = x.STATE,
                        SOTHUTU = x.SOTHUTU.ToString(),
                        XEM = x.XEM,
                        SUA = x.SUA,
                        XOA = x.XOA,
                        THEM = x.THEM,
                        DUYET = x.DUYET
                    };
                    lst.Add(temp);
                }
                return lst;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
