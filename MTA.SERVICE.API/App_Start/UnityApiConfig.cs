using Microsoft.Practices.Unity;
using MTA.ENTITY;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.API.Api;
using MTA.SERVICE.API.Utils;
using MTA.SERVICE.Authorize;
using MTA.SERVICE.Authorize.AuMenu;
using MTA.SERVICE.Authorize.AuNguoiDung;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MTA.SERVICE.API.App_Start
{
    public class UnityApiConfig
    {
        public static void RegisterComponents(HttpConfiguration config)
        {
            var container = new UnityContainer();
            container.RegisterType<IDataContext, MTADbContext>(new HierarchicalLifetimeManager());
            container.RegisterType<IUnitOfWork, UnitOfWork>(new HierarchicalLifetimeManager());

            container.RegisterType<IRepository<AU_NGUOIDUNG>, Repository<AU_NGUOIDUNG>>(new HierarchicalLifetimeManager());
            container.RegisterType<IAuNguoiDungService, AuNguoiDungService>(new HierarchicalLifetimeManager());

            container.RegisterType<IRepository<AU_MENU>, Repository<AU_MENU>>(new HierarchicalLifetimeManager());
            container.RegisterType<IAuMenuService, AuMenuService>(new HierarchicalLifetimeManager());
            container.RegisterType<ISharedService, SharedService>(new HierarchicalLifetimeManager());

            config.DependencyResolver = new UnityResolver(container);
        }
    }
}