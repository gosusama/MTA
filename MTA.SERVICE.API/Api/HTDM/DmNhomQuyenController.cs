using BTS.API.SERVICE.Helper;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Authorize.AuNhomQuyen;
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
using System.Web.Http;
using System.Web.Http.Description;

namespace MTA.SERVICE.API.Api.HTDM
{
    [RoutePrefix("api/DM/NhomQuyen")]
    [Route("{id?}")]
    [Authorize]
    public class DmNhomQuyenController : ApiController
    {
        protected readonly IAuNhomQuyenService _service;
        public DmNhomQuyenController(IAuNhomQuyenService service)
        {
            _service = service;
        }
        [Route("Select_Page")]
        [HttpPost]
        [CustomAuthorize(Method = "XEM", State = "auGroup")]
        public IHttpActionResult Select_Page(JObject jsonData)
        {
            var _unitCode = _service.GetCurrentUnitCode();
            var result = new TransferObj();
            var postData = ((dynamic)jsonData);
            var filtered = ((JObject)postData.filtered).ToObject<FilterObj<AuNhomQuyenVm.Search>>();
            var paged = ((JObject)postData.paged).ToObject<PagedObj<AU_NHOMQUYEN>>();
            var query = new QueryBuilder
            {
                Take = paged.ItemsPerPage,
                Skip = paged.FromItem - 1,
                Filter = new QueryFilterLinQ()
                {
                    Property = ClassHelper.GetProperty(() => new AU_NHOMQUYEN().UnitCode),
                    Value = _unitCode,
                    Method = FilterMethod.EqualTo
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
        [Route("Add")]
        [HttpPost]
        [ResponseType(typeof(AU_NHOMQUYEN))]
        [CustomAuthorize(Method = "THEM", State = "auGroup")]
        public IHttpActionResult Add(AU_NHOMQUYEN instance)
        {
            var _unitCode = _service.GetCurrentUnitCode();
            var result = new TransferObj<AU_NHOMQUYEN>();
            try
            {
                instance.UnitCode = _unitCode;
                var item = _service.Insert(instance);
                _service.UnitOfWork.Save();
                result.Status = true;
                result.Message = "Cập nhật thành công.";
                result.Data = item;
            }
            catch (Exception e)
            {
                result.Status = false;
                result.Message = e.Message;
            }
            return Ok(result);
        }

        [ResponseType(typeof(AU_NHOMQUYEN))]
        [HttpDelete]
        [Route("DeleteItem/{id}")]
        [CustomAuthorize(Method = "XOA", State = "auGroup")]
        public IHttpActionResult DeleteItem(string Id)
        {
            AU_NHOMQUYEN instance = _service.FindById(Id);
            if (instance == null)
            {
                return NotFound();
            }
            try
            {
                var result = new TransferObj<AU_NHOMQUYEN>();
                _service.Delete(instance.Id);
                _service.UnitOfWork.Save();
                result.Status = true;
                result.Message = "Xóa thành công.";
                return Ok(result);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }
    }
}
