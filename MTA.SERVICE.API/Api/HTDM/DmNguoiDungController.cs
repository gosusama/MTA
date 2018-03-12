using BTS.API.SERVICE.Helper;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Authorize.AuNguoiDung;
using MTA.SERVICE.BuildQuery;
using MTA.SERVICE.BuildQuery.Query.Types;
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
    [RoutePrefix("api/DM/NguoiDung")]
    [Route("{id?}")]
    [Authorize]
    public class DmNguoiDungController : ApiController
    {
        private IAuNguoiDungService _service;
        public DmNguoiDungController(IAuNguoiDungService service)
        {
            _service = service;
        }
        [Route("PostQuery")]
        public async Task<IHttpActionResult> PostQuery(JObject jsonData)
        {
            var result = new TransferObj();
            var postData = ((dynamic)jsonData);
            var filtered = ((JObject)postData.filtered).ToObject<FilterObj<AuNguoiDungVm.Search>>();
            var paged = ((JObject)postData.paged).ToObject<PagedObj<AU_NGUOIDUNG>>();
            var unitCode = _service.GetCurrentUnitCode();
            var maDonViCha = _service.GetParentUnitCode();
            var query = new QueryBuilder
            {
                Take = paged.ItemsPerPage,
                Skip = paged.FromItem - 1,
                Filter = new QueryFilterLinQ()
                {
                    Property = ClassHelper.GetProperty(() => new AU_NGUOIDUNG().UnitCode),
                    Method = FilterMethod.StartsWith,
                    Value = maDonViCha
                }
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
        [HttpGet]
        [Route("GetNewInstance/{unitcode?}")]
        public string GetNewInstance(string unitcode)
        {
            if(unitcode != null)
            {
                var ND = _service.Repository.DbSet.Where(x => x.UnitCode == unitcode).OrderByDescending(x=>x.MaNhanVien).FirstOrDefault();
                if (ND != null)
                {
                    string[] temp = ND.MaNhanVien.Split('_');
                    int i = Convert.ToInt16(temp[1]);
                    return unitcode + "-NV_" + (++i).ToString();
                }
                else
                    return unitcode + "-NV_0";
            }
            return null;
        }

        [Route("CheckUserNameExist/{userName?}")]
        [HttpGet]
        public async Task<IHttpActionResult> CheckUserNameExist(string userName)
        {
            var result = new TransferObj();
            var exist = _service.Repository.DbSet.Where(x => x.Username == userName).ToList();
            if (exist.Count > 0)
            {
                result.Status = true;
            }
            else
            {
                result.Status = false;
            }
            return Ok(result);
        }
        [HttpPost]
        [ResponseType(typeof(AU_NGUOIDUNG))]
        [Route("Post")]
        public async Task<IHttpActionResult> Post(AU_NGUOIDUNG instance)
        {
            var result = new TransferObj<AU_NGUOIDUNG>();
            var unitCode = _service.GetCurrentUnitCode();
            var parentUnitCode = _service.GetParentUnitCode();
            var exist = _service.Repository.DbSet.FirstOrDefault(x => x.Username == instance.Username);
            if (exist != null)
            {
                result.Status = false;
                return Ok(result);
            }
            else
            {

                try
                {
                    instance.Password = MD5Encrypt.MD5Hash(instance.Password);
                    instance.ParentUnitcode = parentUnitCode;
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
            }
            return CreatedAtRoute("DefaultApi", new { controller = this, id = instance.Id }, result);
        }
        [HttpDelete]
        [ResponseType(typeof(AU_NGUOIDUNG))]
        [Route("Delete/{id?}")]
        public async Task<IHttpActionResult> Delete(string id)
        {
            AU_NGUOIDUNG instance = await _service.Repository.FindAsync(id);
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
    }
}
