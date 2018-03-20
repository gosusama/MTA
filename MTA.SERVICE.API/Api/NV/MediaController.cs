using AutoMapper;
using MTA.ENTITY.NV;
using MTA.SERVICE.Helper;
using MTA.SERVICE.DM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using MTA.SERVICE.NV;

namespace MTA.SERVICE.API.Api.NV
{
    [RoutePrefix("api/NV/Media")]
    [Route("{id?}")]
    [Authorize]
    public class MediaController : ApiController
    {
        private readonly IMediaService _service;
        public MediaController(IMediaService service)
        {
            _service = service;
        }

        [Route("Insert")]
        public async Task<IHttpActionResult> Post(Media instance)
        {
            var result = new TransferObj<Media>();
            var unitCode = _service.GetCurrentUnitCode();
            var exist = _service.Repository.DbSet.FirstOrDefault(x => x.Link == instance.Link);
            if (exist != null)
            {
                result.Status = false;
                return Ok(result);
            }
            else
            {
                try
                {
                    instance.UnitCode = unitCode;
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

        [HttpPut]
        [ResponseType(typeof(void))]
        [Route("edit/{id?}")]
        public async Task<IHttpActionResult> Put(string id, Media instance)
        {
            var result = new TransferObj<Media>();
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

        [HttpGet]
        [Route("DeleteItem/{code}")]
        public async Task<IHttpActionResult> Delete(string code)
        {
            var dataDelete = _service.Repository.DbSet.Where(x => x.Ma_Dm.Equals(code)).FirstOrDefault();
            if (dataDelete == null)
            {
                return NotFound();
            }
            try
            {
                _service.Delete(dataDelete.Id);
                _service.DeleteFile(dataDelete.Link);
                await _service.UnitOfWork.SaveAsync();
                return Ok();
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        [Route("DeleteAllForCodeParent/{code}")]
        [HttpGet]
        public async Task<IHttpActionResult> DeleteAllForCode(string code)
        {
            var dataDelete = _service.Repository.DbSet.Where(x => x.MaCha.Equals(code)).ToList();
            try
            {
                foreach (var item in dataDelete)
                {
                    _service.DeleteFile(item.Link);
                    _service.Delete(item.Id);
                    await _service.UnitOfWork.SaveAsync();                  
                }
                return Ok();
            }
            catch(Exception e)
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("GetImgForByCodeParent/{code}")]
        public async Task<IHttpActionResult> GetImgForByCodeParent(string code)
        {
            List<MediaVM.ViewImg> lstResult = new List<MediaVM.ViewImg>();
            if(code != null)
            {
                var data = _service.Repository.DbSet.Where(x => x.MaCha == code).ToList();
                foreach(var temp in data)
                {
                    var tm = new MediaVM.ViewImg()
                    {
                        Ma_Dm = temp.Ma_Dm,
                        MaCha = temp.MaCha,
                        Link = temp.Link,
                        Ten_Media = temp.Ten_Media
                    };
                    lstResult.Add(tm);
                }
            }
            return Ok(lstResult);
        }

        [Route("Upload")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> Upload()
        {
            var unitCode = _service.GetCurrentUnitCode();
            var result = new TransferObj<string>();
            try
            {
                result.Status = _service.Upload(unitCode);
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
