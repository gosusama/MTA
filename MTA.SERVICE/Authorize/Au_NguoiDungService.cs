using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MTA.ENTITY;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Helper;
using AutoMapper;
using MTA.SERVICE.Repository;

namespace MTA.SERVICE.Authorize
{
    public interface IAu_NguoiDungService : IRepository<AU_NGUOIDUNG>
    {
        Au_NguoiDungVM.CurrentUser login(Au_NguoiDungVM.ModelLogin user);
    }

    public class Au_NguoiDungService : Repository<AU_NGUOIDUNG>, IAu_NguoiDungService
    {
        public Au_NguoiDungService(MTADbContext dbContext) : base(dbContext)
        {
        }

        public Au_NguoiDungVM.CurrentUser login(Au_NguoiDungVM.ModelLogin model)
        {
            MTADbContext db = new MTADbContext();
            Mapper.CreateMap<AU_NGUOIDUNG, Au_NguoiDungVM.CurrentUser>();
            Au_NguoiDungVM.CurrentUser result = null;
            var user = db.AU_NGUOIDUNGs.Where(x => x.Username == model.Username).FirstOrDefault();
            Console.Write(MD5Encrypt.Encrypt(model.Password));
            if (user != null)
            {
                if (user.Password == MD5Encrypt.Encrypt(model.Password))
                {
                    result = Mapper.Map<AU_NGUOIDUNG, Au_NguoiDungVM.CurrentUser>(user);
                }
            }
            return result;
        }
    }
}
