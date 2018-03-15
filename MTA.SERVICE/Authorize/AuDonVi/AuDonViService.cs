using BTS.API.SERVICE.Helper;
using MTA.ENTITY;
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
namespace MTA.SERVICE.Authorize.AuDonVi
{
    public interface IAuDonViService : IDataInfoService<AU_DONVI>
    {
        string NewIdDonViCha();
        List<ChoiceObj> GetSelectSort();
    }
    public class AuDonViService : DataInfoServiceBase<AU_DONVI>, IAuDonViService
    {
        public AuDonViService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
        public List<ChoiceObj> GetSelectSort()
        {
            var result = new List<ChoiceObj>();
            var merchandiseTypeCollection = Repository.DbSet.ToList();
            var firstLevelMerchanseType =
                merchandiseTypeCollection.Where(item => string.IsNullOrEmpty(item.MaDonViCha)).OrderBy(x => x.TenDonVi).ToList();
            foreach (var merchandise in firstLevelMerchanseType)
            {
                AddData(result, merchandiseTypeCollection, merchandise);
            }
            return result;
        }
        private void AddData(List<ChoiceObj> result, List<AU_DONVI> data, AU_DONVI current, string prefix = "")
        {
            result.Add(new ChoiceObj
            {
                Id = current.Id,
                Value = current.MaDonVi,
                Text = string.Format("{1}{0}", current.TenDonVi, prefix)
            });
            var children = data.Where(item => item.MaDonViCha == current.MaDonVi).ToList();
            foreach (var child in children)
            {
                AddData(result, data, child, prefix + "--");
            }
        }
        public string NewIdDonViCha()
        {
            var data = UnitOfWork.Repository<AU_DONVI>().DbSet.Where(x => x.MaDonViCha == null).OrderByDescending(x => x.MaDonVi).Select(x => x.MaDonVi).FirstOrDefault();
            try
            {
                int i = 0;
                if(data == null)
                {
                    return "DV1";
                }
                else
                {
                    i = Convert.ToInt16(data.Remove(0, 2));
                    return "DV" + (++i).ToString();
                }
            }
            catch (Exception) {
                return null;
            }
        }
        protected override Expression<Func<AU_DONVI, bool>> GetKeyFilter(AU_DONVI instance)
        {
            return x => x.MaDonVi == instance.MaDonVi;
        }
    }
}
