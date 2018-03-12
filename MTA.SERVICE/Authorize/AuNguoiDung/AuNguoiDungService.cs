using AutoMapper;
using MTA.ENTITY;
using MTA.ENTITY.Authorize;
using MTA.SERVICE;
using MTA.SERVICE.Helper;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace MTA.SERVICE.Authorize.AuNguoiDung
{
    public interface IAuNguoiDungService : IDataInfoService<AU_NGUOIDUNG>
    {
        AuNguoiDungVm.Dto CreateNewUser(AuNguoiDungVm.ModelRegister model);
        AuNguoiDungVm.CurrentUser Login(AuNguoiDungVm.ModelLogin model);
        AuNguoiDungVm.Dto FindUser(string username, string password);
    }
    public class AuNguoiDungService : DataInfoServiceBase<AU_NGUOIDUNG>, IAuNguoiDungService
    {
        public AuNguoiDungService(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }
        protected override System.Linq.Expressions.Expression<Func<AU_NGUOIDUNG, bool>> GetKeyFilter(AU_NGUOIDUNG instance)
        {
            var _parent = GetParentUnitCode();
            return x => x.Username == instance.Username && x.UnitCode.StartsWith(_parent);
        }
      
        public AuNguoiDungVm.CurrentUser Login(AuNguoiDungVm.ModelLogin model)
        {
            Mapper.CreateMap<AU_NGUOIDUNG, AuNguoiDungVm.CurrentUser>();
            AuNguoiDungVm.CurrentUser result = null;
            var user = Repository.DbSet.FirstOrDefault(x => x.Username == model.Username);
            if(user !=null)
            {
                if(user.Password == MD5Encrypt.Encrypt(model.Password))
                {
                    result = Mapper.Map<AU_NGUOIDUNG, AuNguoiDungVm.CurrentUser>(user);
                }
            }
            return result;
        }
        public AuNguoiDungVm.Dto FindUser(string username, string password)
        {
            var result = new AuNguoiDungVm.Dto();
            using (var ctx = new MTADbContext())
            {
                var user = ctx.AU_NGUOIDUNGs.FirstOrDefault(x => x.Username == username && x.TrangThai == 10);
                if (user != null)
                {
                    if (user.Password == MD5Encrypt.Encrypt(password))
                    {
                        result = Mapper.Map<AU_NGUOIDUNG, AuNguoiDungVm.Dto>(user);
                        return result;
                    }
                }
                else
                {
                    result =  null;
                }
            }
            return result;
        }
        public AuNguoiDungVm.Dto CreateNewUser(AuNguoiDungVm.ModelRegister model)
        {
            var entity = Mapper.Map<AuNguoiDungVm.ModelRegister, AU_NGUOIDUNG>(model);
            entity.Password = MD5Encrypt.Encrypt(entity.Password);
            entity.Id = Guid.NewGuid().ToString();
            Repository.Insert(entity);
            var result = Mapper.Map<AU_NGUOIDUNG, AuNguoiDungVm.Dto>(entity);
            return result;
        }       
    }
}
