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
    public class DmLoaiTinTucVm
    {
        public class Search : IDataSearch
        {
            public string Ma_LoaiTinTuc { get; set; }
            public string Ten_LoaiTinTuc { get; set; }
            public DateTime? Ngaytao { get; set; }

            public string DefaultOrder
            {
                get
                {
                    return ClassHelper.GetPropertyName(() => new Dm_LoaiTinTuc().Ma_LoaiTinTuc);
                }
            }

            public List<IQueryFilter> GetFilters()
            {
                var result = new List<IQueryFilter>();
                var refObj = new Dm_LoaiTinTuc();

                if (!string.IsNullOrEmpty(this.Ma_LoaiTinTuc))
                {
                    result.Add(new QueryFilterLinQ
                    {
                        Property = ClassHelper.GetProperty(() => refObj.Ma_LoaiTinTuc),
                        Value = this.Ma_LoaiTinTuc,
                        Method = FilterMethod.Like
                    });
                }
                if (!string.IsNullOrEmpty(this.Ten_LoaiTinTuc))
                {
                    result.Add(new QueryFilterLinQ
                    {
                        Property = ClassHelper.GetProperty(() => refObj.Ten_LoaiTinTuc),
                        Value = this.Ten_LoaiTinTuc,
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
                Ma_LoaiTinTuc = summary;
                Ten_LoaiTinTuc = summary;
            }
        }
    }
}
