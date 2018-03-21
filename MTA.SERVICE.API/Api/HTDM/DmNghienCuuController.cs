using MTA.ENTITY.NV;
using MTA.SERVICE.BuildQuery;
using MTA.SERVICE.DM;
using MTA.SERVICE.Helper;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace MTA.SERVICE.API.Api.HTDM
{
    [RoutePrefix("api/DM/NghienCuu")]
    [Route("{id?}")]
    [Authorize]
    public class DmNghienCuuController : ApiController
    {
        private readonly IDmNghienCuuService _service;
        public DmNghienCuuController(IDmNghienCuuService service)
        {
            _service = service;
        }

        [Route("PostQuery")]
        public async Task<IHttpActionResult> PostQuery(JObject jsonData)
        {
            var result = new TransferObj();
            var postData = ((dynamic)jsonData);
            var filtered = ((JObject)postData.filtered).ToObject<FilterObj<DmNghienCuuVm.Search>>();
            var paged = ((JObject)postData.paged).ToObject<PagedObj<Dm_NghienCuu>>();
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

        [HttpPost]
        [ResponseType(typeof(Dm_NghienCuu))]
        [Route("Insert")]
        public async Task<IHttpActionResult> Post(Dm_NghienCuu instance)
        {
            var result = new TransferObj<Dm_NghienCuu>();
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
        public async Task<IHttpActionResult> Put(string id, Dm_NghienCuu instance)
        {
            var result = new TransferObj<Dm_NghienCuu>();
            if (id != instance.Id)
            {
                result.Status = false;
                result.Message = "Id không hợp lệ !";
                return Ok(result);
            }

            try
            {
                var item = _service.Update(instance);
                _service.UnitOfWork.Save();
                result.Status = true;
                result.Message = "Sửa thành công !";
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
        [ResponseType(typeof(Dm_NghienCuu))]
        [Route("DeleteItem/{id?}")]
        public async Task<IHttpActionResult> Delete(string id)
        {
            Dm_NghienCuu instance = await _service.Repository.FindAsync(id);
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
        [HttpGet]
        [Route("getNewInstance")]
        public IHttpActionResult GetNewInstance()
        {
            string ma = _service.Repository.DbSet.OrderByDescending(x => x.Ma_Dm).Select(x => x.Ma_Dm).FirstOrDefault();
            if (ma == null)
            {
                ma = "NC_1";
                return Ok(ma);
            }
            else
            {
                string[] str = ma.Split('_');
                try
                {
                    int i = Convert.ToInt16(str[1]);
                    return Ok("NC_" + (++i).ToString());
                }
                catch (Exception ex)
                {
                    return NotFound();
                }
            }
        }

        [HttpGet]
        [Route("checkExist/{code}")]
        public IHttpActionResult checkExist(string code)
        {
            var temp = _service.Repository.DbSet.Where(x => x.Ma_Cha.Equals(code)).FirstOrDefault();
            if (temp != null)
                return Ok(true);
            return Ok(false);
        }
    }
}
