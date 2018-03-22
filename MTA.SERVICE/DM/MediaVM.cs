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

namespace MTA.SERVICE.NV
{
    public class MediaVM
    {
        public class ViewImg
        {
            public string Ma_Dm { get; set; }
            public string MaCha { get; set; }
            public string Link { get; set; }
            public string Ten_Media { get; set; }
        }
        public class Search : IDataSearch
        {
            public string Ma_Dm { get; set; }
            public string MaCha { get; set; }
            public string Ten_Media { get; set; }
            public string Link { get; set; }
            public string AnhBia { get; set; }
            public int Loai_Media { get; set; }
            public int DoUuTien { get; set; }
            public DateTime? Ngaytao { get; set; }
            public DateTime? Ngayphatsinh { get; set; }
            public string Manguoitao { get; set; }
            public string DefaultOrder
            {
                get
                {
                    return ClassHelper.GetPropertyName(() => new Media().Ma_Dm);
                }
            }

            public List<IQueryFilter> GetFilters()
            {
                var result = new List<IQueryFilter>();
                var refObj = new Media();

                if (!string.IsNullOrEmpty(this.Ma_Dm))
                {
                    result.Add(new QueryFilterLinQ
                    {
                        Property = ClassHelper.GetProperty(() => refObj.Ma_Dm),
                        Value = this.Ma_Dm,
                        Method = FilterMethod.Like
                    });
                }
                if (!string.IsNullOrEmpty(this.Ten_Media))
                {
                    result.Add(new QueryFilterLinQ
                    {
                        Property = ClassHelper.GetProperty(() => refObj.Ten_Media),
                        Value = this.Ten_Media,
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
                Ten_Media = summary;
            }
        }
    }
}
