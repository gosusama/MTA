using BTS.API.SERVICE.Helper;
using MTA.SERVICE.Authorize;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MTA.SERVICE.API.Api
{
    [RoutePrefix("api/Authorize/Shared")]
    [Route("{id?}")]
    [Authorize]
    public class SharedController : ApiController
    {
        private readonly ISharedService _service;

        public SharedController(ISharedService service)
        {
            _service = service;
        }
        [HttpGet]
        [Route("GetAccesslist/{machucnang}")]
        public RoleState GetAccesslist(string machucnang)
        {
            var _unitCode = _service.GetCurrentUnitCode();
            RoleState roleState = _service.GetRoleStateByMaChucNang(_unitCode, RequestContext.Principal.Identity.Name, machucnang);
            return roleState;
        }
    }
}
