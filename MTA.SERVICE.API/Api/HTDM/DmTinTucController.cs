using MTA.ENTITY.NV;
using MTA.SERVICE.BuildQuery;
using MTA.SERVICE.Helper;
using MTA.SERVICE.NV;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace MTA.SERVICE.API.Api.HTDM
{
    [RoutePrefix("api/DM/TinTuc")]
    [Route("{id?}")]
    [Authorize]
    public class DmTinTucController : ApiController
    {
        private readonly IDmTinTucService _service;

        public DmTinTucController(IDmTinTucService service)
        {
            _service = service;
        }

        [Route("PostQuery")]
        public async Task<IHttpActionResult> PostQuery(JObject jsonData)
        {
            var result = new TransferObj();
            var postData = ((dynamic)jsonData);
            var filtered = ((JObject)postData.filtered).ToObject<FilterObj<DmTinTucVm.Search>>();
            var paged = ((JObject)postData.paged).ToObject<PagedObj<Dm_TinTuc>>();
            var query = new QueryBuilder
            {
                Take = paged.ItemsPerPage,
                Skip = paged.FromItem - 1,
            };
            try
            {
                var filterResult = _service.Filter(filtered, query);
                if (!filterResult.WasSuccessful)
                {
                    return NotFound();
                }
                result.Data = filterResult.Value;
                result.Status = true;
                return Ok(result);
            }
            catch (Exception e)
            {
                return InternalServerError();
            }
        }
    }
}