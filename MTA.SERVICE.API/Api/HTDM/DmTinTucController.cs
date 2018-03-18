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
using System.Web.Http.Description;

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

        [HttpPost]
        [ResponseType(typeof(Dm_TinTuc))]
        [Route("Insert")]
        public async Task<IHttpActionResult> Post(Dm_TinTuc instance)
        {
            var result = new TransferObj<Dm_TinTuc>();
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

        [HttpPut]
        [ResponseType(typeof(void))]
        [Route("edit/{id?}")]
        public async Task<IHttpActionResult> Put(string id, Dm_TinTuc instance)
        {
            var result = new TransferObj<Dm_TinTuc>();
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

        [HttpDelete]
        [ResponseType(typeof(Dm_TinTuc))]
        [Route("DeleteItem/{id?}")]
        public async Task<IHttpActionResult> Delete(string id)
        {
            Dm_TinTuc instance = await _service.Repository.FindAsync(id);
            if (instance == null)
            {
                return NotFound();
            }
            try
            {
                _service.Delete(instance.Id);
                await _service.UnitOfWork.SaveAsync();
                return Ok(instance);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
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