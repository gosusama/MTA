using AutoMapper;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using MTA.ENTITY;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Authorize;
using MTA.SERVICE.Authorize.AuNguoiDung;
using MTA.SERVICE.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace MTA.SERVICE.API.Provider
{
    public class MTAOAUTHPROVIDER : OAuthAuthorizationServerProvider
    {
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            MTADbContext db = new MTADbContext();
            Mapper.CreateMap<AU_NGUOIDUNG, AuNguoiDungVm.CurrentUser>();
            AuNguoiDungVm.CurrentUser result = null;
            var user = db.AU_NGUOIDUNGs.Where(x => x.Username == context.UserName).FirstOrDefault();
            if (user != null)
            {
                if (user.Password == MD5Encrypt.Encrypt(context.Password))
                {
                    result = Mapper.Map<AU_NGUOIDUNG, AuNguoiDungVm.CurrentUser>(user);
                }
            }
            if (user == null)
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }
            Action<ClaimsIdentity, string> addClaim = (ClaimsIdentity obj, string username) => { return; };
            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
            addClaim.Invoke(identity, user.Username);
            identity.AddClaim(new Claim(ClaimTypes.Role, "MEMBER"));
            identity.AddClaim(new Claim("unitCode", user.UnitCode));
            identity.AddClaim(new Claim("parentUnitCode", user.ParentUnitcode));
            AuthenticationProperties properties = new AuthenticationProperties(new Dictionary<string, string>
                    {
                    {
                        "userName", string.IsNullOrEmpty(user.Username)?string.Empty:user.Username
                    },
                    {
                        "fullName", string.IsNullOrEmpty(user.TenNhanVien)?string.Empty:user.TenNhanVien
                    },
                    {
                        "code", string.IsNullOrEmpty(user.MaNhanVien)?string.Empty:user.MaNhanVien
                    },
                    {
                        "phone", string.IsNullOrEmpty(user.SoDienThoai)?string.Empty:user.SoDienThoai
                    },
                    {
                        "chungMinhThu", string.IsNullOrEmpty(user.ChungMinhThu)?string.Empty:user.ChungMinhThu
                    },
                    {
                        "unitCode", string.IsNullOrEmpty(user.UnitCode)?string.Empty:user.UnitCode
                    },
                    {
                        "parentUnitCode", string.IsNullOrEmpty(user.ParentUnitcode)?string.Empty:user.ParentUnitcode
                    }
                    });

            AuthenticationTicket ticket = new AuthenticationTicket(identity, properties);
            context.Validated(ticket);
            context.Request.Context.Authentication.SignIn(identity);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // Resource owner password credentials does not provide a client ID.
            if (context.ClientId == null)
            {
                context.Validated();
            }

            return Task.FromResult<object>(null);
        }

    }
}
