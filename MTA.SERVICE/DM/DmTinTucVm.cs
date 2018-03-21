using BTS.API.SERVICE.Helper;
using MTA.ENTITY.NV;
using MTA.SERVICE.BuildQuery;
using MTA.SERVICE.BuildQuery.Query.Types;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.SERVICE.DM
{
    public class DmTinTucVm
    {
        public class Search : IDataSearch
        {
            public string Ma_Dm { get; set; }
            public string Ma_Cha { get; set; }
            public string Ten_Dm { get; set; }
            public string NoiDung { get; set; }
            public string ChiTietNoiDung { get; set; }
            public string TepDinhKem { get; set; }
            public int Loai_Dm { get; set; }
            public int DoUuTien { get; set; }
            public DateTime? Ngaytao { get; set; }
            public DateTime? Ngayphatsinh { get; set; }
            public string Manguoitao { get; set; }
            public string Anh { get; set; }
            public string Video { get; set; }
            public int LuotXem { get; set; }

            public string DefaultOrder
            {
                get
                {
                    return ClassHelper.GetPropertyName(() => new Dm_TinTuc().Ma_Dm);
                }
            }

            public List<IQueryFilter> GetFilters()
            {
                var result = new List<IQueryFilter>();
                var refObj = new Dm_TinTuc();

                if (!string.IsNullOrEmpty(this.Ma_Dm))
                {
                    result.Add(new QueryFilterLinQ
                    {
                        Property = ClassHelper.GetProperty(() => refObj.Ma_Dm),
                        Value = this.Ma_Dm,
                        Method = FilterMethod.Like
                    });
                }
                if (!string.IsNullOrEmpty(this.Ten_Dm))
                {
                    result.Add(new QueryFilterLinQ
                    {
                        Property = ClassHelper.GetProperty(() => refObj.Ten_Dm),
                        Value = this.Ten_Dm,
                        Method = FilterMethod.Like
                    });
                }
                return result;
            }
            public List<IQueryFilter> GetQuickFilters()
            {
                return null;
            }
            public void LoadGeneralParam(string summary)
            {
                Ma_Dm = summary;
                Ten_Dm = summary;
            }
        }
    }
}
