using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

using System.Web;
using System.Security.Claims;
using MTA.ENTITY;
using System.Web.Configuration;

namespace MTA.SERVICE.Services
{
    public class DataInfoServiceBase<TEntity> : EntityServiceBase<TEntity>, IDataInfoService<TEntity>
        where TEntity : DataInfoEntity
    {
        public DataInfoServiceBase(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
            Mapper.CreateMap<TEntity, TEntity>().IgnoreDataInfoSelfMapping();
        }

        public virtual IDataInfoService<TEntity> Include(Expression<Func<TEntity, object>> include)
        {
            Includes.Add(include);
            ((IQueryable<TEntity>) Repository.DbSet).Include(include);
            return this;
        }

        protected virtual Expression<Func<TEntity, bool>> GetIdFilter(string id)
        {
            return x => x.Id == id;
        }

        protected virtual Expression<Func<TEntity, bool>> GetKeyFilter(TEntity instance)
        {
            return x => x.Id == instance.Id;
        }
        public virtual TEntity Find(TEntity instance, bool notracking = false)
        {
            var result = (notracking ? Repository.DbSet.AsNoTracking() : Repository.DbSet)
                .FirstOrDefault(GetKeyFilter(instance));
            return result;
        }

        public virtual TEntity FindById(string id, bool notracking = false)
        {
            var result = (notracking ? Repository.DbSet.AsNoTracking() : Repository.DbSet)
                .FirstOrDefault(GetIdFilter(id));
            return result;
        }

        public string GetPhysicalPathImportFile()
        {
            return WebConfigurationManager.AppSettings["rootPhysical"] + "\\Upload\\ImportFile\\";
        }
        public virtual TEntity Insert(TEntity instance, bool withUnitCode = true)
        {
            var exist = Find(instance, true);
            if (exist != null)
            {
                throw new Exception("Tồn tại bản ghi có cùng mã!");
            }
            var newInstance = Mapper.Map<TEntity, TEntity>(instance);
            newInstance.Id = Guid.NewGuid().ToString();
            if (withUnitCode) { Repository.Insert(AddUnit(newInstance)); }
            else
            {
                newInstance.UnitCode = instance.UnitCode;
                Repository.Insert(newInstance);
            }
            return newInstance;
        }

        public virtual TEntity AddUnit(TEntity instance)
        {
            if (HttpContext.Current != null && HttpContext.Current.User is ClaimsPrincipal)
            {
                var currentUser = (HttpContext.Current.User as ClaimsPrincipal);
                var unit = currentUser.Claims.FirstOrDefault(x => x.Type == "unitCode");
                if (unit != null)
                {
                    instance.UnitCode = unit.Value;
                }
            }
            
            return instance;
        }
        
        public virtual string GetCurrentUnitCode()
        {
            if (HttpContext.Current != null && HttpContext.Current.User is ClaimsPrincipal)
            {
                var currentUser = (HttpContext.Current.User as ClaimsPrincipal);
                var unit = currentUser.Claims.FirstOrDefault(x => x.Type == "unitCode");
                if (unit != null) return unit.Value;
            }
            return "";
        }
        public virtual string GetParentUnitCode()
        {
            if (HttpContext.Current != null && HttpContext.Current.User is ClaimsPrincipal)
            {
                var currentUser = (HttpContext.Current.User as ClaimsPrincipal);
                var parentunit = currentUser.Claims.FirstOrDefault(x => x.Type == "parentUnitCode");
                if (parentunit != null) return parentunit.Value;
            }
            return "";
        }
        public virtual ClaimsPrincipal GetClaimsPrincipal()
        {
            var currentClaims = new ClaimsPrincipal();
            if (HttpContext.Current != null && HttpContext.Current.User is ClaimsPrincipal)
            {
                currentClaims = (HttpContext.Current.User as ClaimsPrincipal);
            }
            return currentClaims;
        }
        public virtual TEntity Update(TEntity instance,
            Action<TEntity, TEntity> updateAction = null,
            Func<TEntity, TEntity, bool> updateCondition = null)
        {
            var entity = Find(instance, false);
            if (entity == null || instance.Id != entity.Id)
            {
                throw new Exception("Bản ghi không tồn tại trong hệ thống");
            }
            var allowUpdate = updateCondition == null || updateCondition(
                instance, entity);
            if (allowUpdate)
            {
                if (updateAction == null)
                {
                    Mapper.Map(instance, entity);
                }
                else
                {
                    updateAction(instance, entity);
                }
                entity.ObjectState = ObjectState.Modified;
            }
            return entity;
        }

        public virtual TEntity Delete(string id)
        {
            var entity = FindById(id, false);
            if (entity == null)
            {
                throw new Exception("Bản ghi không tồn tại trong hệ thống");
            }
            entity.ObjectState = ObjectState.Deleted;
            return entity;
        }

        public void WiteLog(DateTime ngay, string maMayBan, string maNhanVien, string trangThai, string unitCode, string userName)
        {
            throw new NotImplementedException();
        }
    }
}