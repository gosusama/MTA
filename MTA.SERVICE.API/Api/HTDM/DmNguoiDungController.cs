using BTS.API.SERVICE.Helper;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Authorize.AuNguoiDung;
using MTA.SERVICE.Authorize.Utils;
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
        [CustomAuthorize(Method = "THEM", State = "sys_User")]
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
        [CustomAuthorize(Method = "XOA", State = "sys_User")]
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

        [HttpPut]
        [ResponseType(typeof(void))]
        [CustomAuthorize(Method = "SUA", State = "sys_User")]
        public async Task<IHttpActionResult> Put(string id, AU_NGUOIDUNG instance)
        {
            var result = new TransferObj<AU_NGUOIDUNG>();
            if (id != instance.Id)
            {
                result.Status = false;
                result.Message = "Id không hợp lệ";
                return Ok(result);
            }

            try
            {
                instance.Password = MD5Encrypt.MD5Hash(instance.Password);
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
        [HttpGet]
        [ResponseType(typeof(AU_NGUOIDUNG))]
        [CustomAuthorize(Method = "XEM", State = "sys_User")]
        public IHttpActionResult Get(string id)
        {
            var instance = _service.FindById(id);
            if (instance == null)
            {
                return NotFound();
            }
            return Ok(instance);
        }
        [Route("GetTargetUser/{id}")]
        [ResponseType(typeof(AU_NGUOIDUNG))]
        public IHttpActionResult GetTargetUser(string id)
        {
            var instance = _service.Repository.DbSet.Where(x => x.Id == id).Select(x => new { x.MaNhanVien, x.SoDienThoai, x.TenNhanVien }).FirstOrDefault();
            if (instance == null)
            {
                return NotFound();
            }
            return Ok(instance);
        }
        //----------
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _service.Repository.DataContext.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
