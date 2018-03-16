using BTS.API.SERVICE.Helper;
using MTA.ENTITY.NV;
using MTA.SERVICE.BuildQuery;
using MTA.SERVICE.Helper;
using MTA.SERVICE.NV;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace MTA.SERVICE.API.Api
{
    [RoutePrefix("api/DM/GioiThieu")]
    [Route("{id?}")]
    [Authorize]
    public class DmGioiThieuController : ApiController
    {
        private readonly IDmGioiThieuService _service;
        public DmGioiThieuController(IDmGioiThieuService service)
        {
            _service = service;
        }

        [HttpPost]
        [ResponseType(typeof(Dm_GioiThieu))]
        [Route("Insert")]
        public async Task<IHttpActionResult> Post(Dm_GioiThieu instance)
        {
            var result = new TransferObj<Dm_GioiThieu>();
            try
            {
                var item = _service.Insert(instance);
                _service.UnitOfWork.Save();
                result.Status = true;
                result.Data = item;
            }
            catch (Exception e)
            {
                result.Status = false;
                result.Message = e.Message;
                return Ok(result);
            }
            return CreatedAtRoute("DefaultApi", new { controller = this, id = instance.Id }, result);
        }

        [Route("PostQuery")]
        public async Task<IHttpActionResult> PostQuery(JObject jsonData)
        {
            var result = new TransferObj();
            var postData = ((dynamic)jsonData);
            var filtered = ((JObject)postData.filtered).ToObject<FilterObj<DmGioiThieuVm.Search>>();
            var paged = ((JObject)postData.paged).ToObject<PagedObj<Dm_GioiThieu>>();
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

        [HttpPut]
        [ResponseType(typeof(void))]
        [Route("edit/{id?}")]
        public async Task<IHttpActionResult> Put(string id, Dm_GioiThieu instance)
        {
            var result = new TransferObj<Dm_GioiThieu>();
            if (id != instance.Id)
            {
                result.Status = false;
                result.Message = "Id không hợp lệ";
                return Ok(result);
            }

            try
            {
                var item = _service.Update(instance);
                _service.UnitOfWork.Save();
                result.Status = true;
                result.Message = "Sửa thành công";
                result.Data = item;
                return Ok(result);
            }
            catch (Exception e)
            {
                result.Status = false;
                result.Message = e.Message;
                return Ok(result);
            }
        }

        [Route("Upload")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> Upload()
        {
            var result = new TransferObj<string>();
            try
            {
                result.Status = true;
                result.Data = _service.UploadImage();
                return Ok(result);
            }
            catch (Exception e)
            {
                result.Status = false;
                result.Message = e.Message;
                return Ok(result);
            }
        }
    }
}
