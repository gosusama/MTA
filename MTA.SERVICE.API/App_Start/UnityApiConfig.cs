﻿using Microsoft.Practices.Unity;
using MTA.ENTITY;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.API.Api;
using MTA.SERVICE.API.Utils;
using MTA.SERVICE.Authorize;
using MTA.SERVICE.Authorize.AuMenu;
using MTA.SERVICE.Authorize.AuNguoiDung;
using MTA.SERVICE.Authorize.AuNguoiDungNhomQuyen;
using MTA.SERVICE.Authorize.AuNhomQuyen;
using MTA.SERVICE.Authorize.AuNhomQuyenChucNang;
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

            container.RegisterType<IRepository<AU_NHOMQUYEN>, Repository<AU_NHOMQUYEN>>(new HierarchicalLifetimeManager());
            container.RegisterType<IAuNhomQuyenService, AuNhomQuyenService>(new HierarchicalLifetimeManager());

            container.RegisterType<IRepository<AU_NHOMQUYEN_CHUCNANG>, Repository<AU_NHOMQUYEN_CHUCNANG>>(new HierarchicalLifetimeManager());
            container.RegisterType<IAuNhomQuyenChucNangService, AuNhomQuyenChucNangService>(new HierarchicalLifetimeManager());

            container.RegisterType<IRepository<AU_NGUOIDUNG_NHOMQUYEN>, Repository<AU_NGUOIDUNG_NHOMQUYEN>>(new HierarchicalLifetimeManager());
            container.RegisterType<IAuNguoiDungNhomQuyenService, AuNguoiDungNhomQuyenService>(new HierarchicalLifetimeManager());

            config.DependencyResolver = new UnityResolver(container);
        }
    }
}