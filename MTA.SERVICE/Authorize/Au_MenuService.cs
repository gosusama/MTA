
using MTA.ENTITY.Authorize;
using MTA.SERVICE.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using MTA.ENTITY;
using AutoMapper;

namespace MTA.SERVICE.Authorize
{
    public interface IAu_MenuService : IRepository<AU_MENU>
    {
        List<Au_Menu_Vm> GetAllMenu();
    }
    public class Au_MenuService : Repository<AU_MENU>, IAu_MenuService
    {
        public Au_MenuService(MTADbContext dbContext) : base(dbContext)
        {
        }
        public List<Au_Menu_Vm> GetAllMenu()
        {
            var lstMenu = (from mn in this._dbContext.AU_MENUs
                           where(mn.TrangThai == 10)
                           orderby mn.Sort 
                           select new{
                               Id = mn.Id,
                               Text = mn.Title,
                               Parent = mn.MenuIdCha,
                               Value = mn.MenuId
                           }).ToList();
            List<Au_Menu_Vm> result = new List<Au_Menu_Vm>();
            foreach (var temp in lstMenu)
            {
                Au_Menu_Vm item = new Au_Menu_Vm()
                {
                    Id = temp.Id,
                    Text = temp.Text,
                    Parent = temp.Parent,
                    Value = temp.Value
                };
                result.Add(item);
            }
            return result;
        }
    }

    public class Au_Menu_Vm
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string Parent { get; set; }
        public string Value { get; set; }
        public List<Au_Menu_Vm> Children { get; set; }
    }
}
