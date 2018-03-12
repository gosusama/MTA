using BTS.API.SERVICE.Helper;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Authorize.AuMenu;
using MTA.SERVICE.BuildQuery;
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
    [RoutePrefix("api/DM/Menu")]
    [Route("{id?}")]
    [Authorize]
    public class DmMenuController : ApiController
    {
        protected readonly IAuMenuService _service;
        public DmMenuController(IAuMenuService service)
        {
            _service = service;
        }
        [Route("PostQuery")]
        public async Task<IHttpActionResult> PostQuery(JObject jsonData)
        {
            var result = new TransferObj();
            var postData = ((dynamic)jsonData);
            var filtered = ((JObject)postData.filtered).ToObject<FilterObj<AuMenuVm.Search>>();
            var paged = ((JObject)postData.paged).ToObject<PagedObj<AU_MENU>>();
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
        [ResponseType(typeof(AU_MENU))]
        [Route("Insert")]
        public async Task<IHttpActionResult> Post(AU_MENU instance)
        {
            var result = new TransferObj<AU_MENU>();
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
        public async Task<IHttpActionResult> Put(string id, AU_MENU instance)
        {
            var result = new TransferObj<AU_MENU>();
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
        [ResponseType(typeof(AU_MENU))]
        [Route("DeleteItem/{id?}")]
        public async Task<IHttpActionResult> Delete(string id)
        {
            AU_MENU instance = await _service.Repository.FindAsync(id);
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
        [Route("GetMenu/{username}")]
        public IHttpActionResult GetMenu(string username)
        {
            var _unitCode = _service.GetCurrentUnitCode();
            var result = new TransferObj<List<ChoiceObj>>();
            List<AU_MENU> lstMenu = new List<AU_MENU>();
            lstMenu = _service.Repository.DbSet.Where(x => x.TrangThai == 10).OrderBy(x => x.Sort).ToList();
            //if (username.Equals("admin"))
            //{
               
            //}
            //else
            //{
            //    lstMenu = _service.GetAllForStarting(username, _unitCode);
            //}
            result.Data = new List<ChoiceObj>();
            if (lstMenu != null)
            {
                lstMenu.ForEach(x =>
                {
                    ChoiceObj obj = new ChoiceObj()
                    {
                        Id = x.Id,
                        Text = x.Title,
                        Parent = x.MenuIdCha,
                        Value = x.MenuId,
                    };
                    result.Data.Add(obj);
                });
            }
            return Ok(result);
        }

        [Route("GetMenuForByCode/{code?}")]
        public string GetMenuForByCode(string code)
        {
            string MaMN = _service.Repository.DbSet.Where(x => x.MenuId.Equals(code) && x.TrangThai == 10).Select(x=>x.MenuId).FirstOrDefault();
            if (MaMN != null)
                return MaMN;
            else
                return null;
        }
    }
}
