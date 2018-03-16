﻿using AutoMapper;
using BTS.API.SERVICE.Helper;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Authorize.AuDonVi;
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
    [RoutePrefix("api/DM/DonVi")]
    [Route("{id?}")]
    [Authorize]
    public class DmDonViController : ApiController
    {
        private readonly IAuDonViService _service;
        public DmDonViController(IAuDonViService service)
        {
            _service = service;
        }
        [Route("GetSelectData")]
        public IList<ChoiceObj> GetSelectData()
        {
            var data = _service.Repository.DbSet;
            return data.Select(x => new ChoiceObj { Value = x.MaDonVi, Text = x.MaDonVi + " | " + x.TenDonVi, Id = x.Id, Description = x.TenDonVi, Parent = x.MaDonViCha, ExtendValue = x.DiaChi, ReferenceDataId = x.SoDienThoai }).ToList();
        }
        [Route("GetSelectDataByUnitCode")]
        public IList<ChoiceObj> GetSelectDataByUnitCode()
        {
            var maDonVi = _service.GetParentUnitCode();
            var data = _service.Repository.DbSet;
            return data.Where(x => x.MaDonVi.StartsWith(maDonVi)).Select(x => new ChoiceObj { Value = x.MaDonVi, Text = x.MaDonVi + " | " + x.TenDonVi, Id = x.Id, Description = x.TenDonVi }).ToList();
        }
        [Route("GetSelectAll")]
        public IList<ChoiceObj> GetSelectAll()
        {
            var data = _service.Repository.DbSet;
            return _service.GetSelectSort();
        }

        [ResponseType(typeof(AU_DONVI))]
        [Route("Post")]
        public async Task<IHttpActionResult> Post(AU_DONVI instance)
        {
            var result = new TransferObj<AU_DONVI>();
            try
            {
                instance.TrangThai = 10;
                var item = _service.Insert(instance);
                _service.UnitOfWork.Save();
                result.Status = true;
                result.Message = "Thêm mới thành công";
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

        [ResponseType(typeof(AU_DONVI))]
        [Route("PostChild")]
        public async Task<IHttpActionResult> PostChild(AuDonViVm.Dto postObj)
        {

            var result = new TransferObj<AU_DONVI>();
            try
            {
                Mapper.CreateMap<AuDonViVm.Dto, AU_DONVI>();
                var instance = Mapper.Map<AuDonViVm.Dto, AU_DONVI>(postObj);
                instance.TrangThai = 10;
                var item = _service.Insert(instance, false);
                _service.UnitOfWork.Save();
                result.Status = true;
                result.Message = "Thêm mới thành công";
                result.Data = item;
            }
            catch (Exception e)
            {
                result.Status = false;
                result.Message = e.Message;
                return Ok(result);
            }
            return CreatedAtRoute("DefaultApi", new { controller = this }, result);
        }

        [Route("PostSelectData")]
        public async Task<IHttpActionResult> PostSelectData(JObject jsonData)
        {
            var result = new TransferObj();
            var postData = ((dynamic)jsonData);
            var filtered = ((JObject)postData.filtered).ToObject<FilterObj<AuDonViVm.Search>>();
            var paged = ((JObject)postData.paged).ToObject<PagedObj<AU_DONVI>>();
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
                Mapper.CreateMap<AU_DONVI, ChoiceObj>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Text, opt => opt.MapFrom(src => string.Format("[{0}]-{1}", src.MaDonVi, src.TenDonVi)))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.TenDonVi))
                .ForMember(dest => dest.Selected, opt => opt.UseValue(true))
                .ForMember(dest => dest.OldSelected, opt => opt.UseValue(true));
                result.Data = Mapper.Map<PagedObj<AU_DONVI>, PagedObj<ChoiceObj>>(filterResult.Value);
                result.Status = true;
                return Ok(result);
            }
            catch (Exception e)
            {
                return InternalServerError();
            }
        }
        [Route("PostSelectDataForReport")]
        public async Task<IHttpActionResult> PostSelectDataForReport(JObject jsonData)
        {

            var result = new TransferObj();
            var postData = ((dynamic)jsonData);
            var _parentUnitCode = _service.GetParentUnitCode();
            var filtered = ((JObject)postData.filtered).ToObject<FilterObj<AuDonViVm.Search>>();
            var paged = ((JObject)postData.paged).ToObject<PagedObj<AU_DONVI>>();
            var query = new QueryBuilder
            {
                Take = paged.ItemsPerPage,
                Skip = paged.FromItem - 1,
                Filter = new QueryFilterLinQ()
                {
                    Property = ClassHelper.GetProperty(() => new AU_DONVI().MaDonVi),
                    Method = FilterMethod.StartsWith,
                    Value = _parentUnitCode
                }
            };
            try
            {
                var filterResult = _service.Filter(filtered, query);
                if (!filterResult.WasSuccessful)
                {
                    return NotFound();
                }
                result.Data = Mapper.Map<PagedObj<AU_DONVI>, PagedObj<ChoiceObj>>(filterResult.Value);
                result.Status = true;
                return Ok(result);
            }
            catch (Exception e)
            {
                return InternalServerError();
            }
        }
        [Route("PostQuery")]
        public async Task<IHttpActionResult> PostQuery(JObject jsonData)
        {
            var parentUnitCode = _service.GetParentUnitCode();
            var result = new TransferObj();
            var postData = ((dynamic)jsonData);
            var filtered = ((JObject)postData.filtered).ToObject<FilterObj<AuDonViVm.Search>>();
            var paged = ((JObject)postData.paged).ToObject<PagedObj<AU_DONVI>>();
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
            catch (Exception)
            {
                return InternalServerError();
            }
        }
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> Put(string id, AU_DONVI instance)
        {
            var result = new TransferObj<AU_DONVI>();
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
                result.Data = item;
                result.Message = "Cập nhật thành công";
                return Ok(result);
            }
            catch (Exception e)
            {
                result.Status = false;
                result.Message = e.Message;
                return Ok(result);
            }
        }
        [ResponseType(typeof(AU_DONVI))]
        public async Task<IHttpActionResult> Delete(string id)
        {
            AU_DONVI instance = await _service.Repository.FindAsync(id);
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
        [Route("GetUnitName/{maDonVi}")]
        [ResponseType(typeof(AU_DONVI))]
        public IHttpActionResult GetUnitName(string maDonVi)
        {
            var value = _service.Repository.DbSet.Where(x => x.MaDonVi == maDonVi).Select(x => x.TenDonVi).FirstOrDefault();
            if (value == null)
            {
                return NotFound();
            }
            return Ok(value);
        }
        [Route("GetNewCode")]
        public string GetNewCode()
        {
            return _service.NewIdDonViCha();
        }

        [Route("NewIdDonViCon/{parent}")]
        [HttpGet]
        public string NewIdDonViCon(string parent)
        {
            return _service.NewIdDonViCon(parent);
        }
    }
}
