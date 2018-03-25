using MTA.ENTITY.NV;
using MTA.SERVICE.BuildQuery;
using MTA.SERVICE.Helper;
using MTA.SERVICE.DM;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using BTS.API.SERVICE.Helper;
using AutoMapper;

namespace MTA.SERVICE.API.Api.HTDM
{
    [RoutePrefix("api/DM/LoaiTinTuc")]
    [Route("{id?}")]
    [Authorize]
    public class DmLoaiTinTucController : ApiController
    {
        private readonly IDmLoaiTinTucService _service;

        public DmLoaiTinTucController(IDmLoaiTinTucService service)
        {
            _service = service;
        }

        [HttpPost]
        [ResponseType(typeof(Dm_LoaiTinTuc))]
        [Route("Insert")]
        public async Task<IHttpActionResult> Post(Dm_LoaiTinTuc instance)
        {
            var result = new TransferObj<Dm_LoaiTinTuc>();
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
        public async Task<IHttpActionResult> Put(string id, Dm_LoaiTinTuc instance)
        {
            var result = new TransferObj<Dm_LoaiTinTuc>();
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
        [ResponseType(typeof(Dm_LoaiTinTuc))]
        [Route("DeleteItem/{id?}")]
        public async Task<IHttpActionResult> Delete(string id)
        {
            Dm_LoaiTinTuc instance = await _service.Repository.FindAsync(id);
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
            var filtered = ((JObject)postData.filtered).ToObject<FilterObj<DmLoaiTinTucVm.Search>>();
            var paged = ((JObject)postData.paged).ToObject<PagedObj<Dm_LoaiTinTuc>>();
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

        [HttpGet]
        [Route("getNewInstance")]
        public IHttpActionResult GetNewInstance()
        {
            string ma = _service.Repository.DbSet.OrderByDescending(x => x.Ma_LoaiTinTuc).Select(x => x.Ma_LoaiTinTuc).FirstOrDefault();
            if (ma == null)
            {
                ma = "LTT_1";
                return Ok(ma);
            }
            else
            {
                string[] str = ma.Split('_');
                try
                {
                    int i = Convert.ToInt16(str[1]);
                    return Ok("LTT_" + (++i).ToString());
                }
                catch (Exception ex)
                {
                    return NotFound();
                }
            }
        }

        [Route("dmLoaiTinTucCtl_GetSelectDataByUnitCode_page")]
        public async Task<IHttpActionResult> dmLoaiTinTucCtl_GetSelectDataByUnitCode_page(JObject jsonData)
        {
            var result = new TransferObj();
            var postData = ((dynamic)jsonData);
            var filtered = ((JObject)postData.filtered).ToObject<FilterObj<DmLoaiTinTucVm.Search>>();
            var paged = ((JObject)postData.paged).ToObject<PagedObj<Dm_LoaiTinTuc>>();
            var _ParentUnitCode = _service.GetParentUnitCode();
            var query = new QueryBuilder
            {
                Take = paged.ItemsPerPage,
                Skip = paged.FromItem - 1,
                Filter = new QueryFilterLinQ()
                {
                    Property = ClassHelper.GetProperty(() => new Dm_LoaiTinTuc().UnitCode),
                    Method = BuildQuery.Query.Types.FilterMethod.StartsWith,
                    Value = _ParentUnitCode
                }
            };
            try
            {
                var filterResult = _service.Filter(filtered, query);
                if (!filterResult.WasSuccessful)
                {
                    return NotFound();
                }

                result.Data = Mapper.Map<PagedObj<Dm_LoaiTinTuc>, PagedObj<ChoiceObj>>
                    (filterResult.Value);
                result.Status = true;
                return Ok(result);
            }
            catch (Exception e)
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("FilterLoaiTinTuc/{ma_LoaiTinTuc}")]
        [ResponseType(typeof(Dm_LoaiTinTuc))]
        public Dm_LoaiTinTuc FilterLoaiTinTuc(string ma_LoaiTinTuc)
        {
            var loaiTinTuc = new Dm_LoaiTinTuc();
            if (string.IsNullOrEmpty(ma_LoaiTinTuc))
            {
                loaiTinTuc = null;
            }
            else
            {
                ma_LoaiTinTuc = ma_LoaiTinTuc.ToUpper();
                ma_LoaiTinTuc = ma_LoaiTinTuc.Trim();
                var unitCode = _service.GetCurrentUnitCode();
                loaiTinTuc = _service.Repository.DbSet.Where(x => x.Ma_LoaiTinTuc == ma_LoaiTinTuc).FirstOrDefault(x => x.UnitCode == unitCode);
                if (loaiTinTuc != null)
                {
                    return loaiTinTuc;
                }
                else
                {
                    loaiTinTuc = null;
                }
            }
            return loaiTinTuc;
        }
    }
}