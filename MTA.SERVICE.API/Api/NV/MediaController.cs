using AutoMapper;
using MTA.ENTITY.NV;
using MTA.SERVICE.Helper;
using MTA.SERVICE.NV;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

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
