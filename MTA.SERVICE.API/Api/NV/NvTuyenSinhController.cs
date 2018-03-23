using MTA.SERVICE.NV;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MTA.SERVICE.API.Api.NV
{
    [RoutePrefix("api/NV/TuyenSinh")]
    [Route("{id?}")]
    [Authorize]
    public class NvTuyenSinhController : ApiController
    {
        private readonly INvTuyenSinhService _service;
    }
}