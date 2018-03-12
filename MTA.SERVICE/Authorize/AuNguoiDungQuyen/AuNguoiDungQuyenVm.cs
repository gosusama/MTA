using MTA.ENTITY;
using System;
using System.Collections.Generic;
namespace BTS.API.SERVICE.Authorize.AuNguoiDungQuyen
{
    public class AuNguoiDungQuyenVm
    {
        public class ViewModel:DataInfoEntity
        {
            public string USERNAME { get; set; }
            public string MACHUCNANG { get; set; }
            public string TENCHUCNANG { get; set; }
            public string SOTHUTU { get; set; }
            public bool XEM { get; set; }
            public bool THEM { get; set; }
            public bool SUA { get; set; }
            public bool XOA { get; set; }
            public bool DUYET { get; set; }

            public ViewModel()
            {
                Id = Guid.NewGuid().ToString();
                XEM = false;
                THEM = false;
                SUA = false;
                XOA = false;
                DUYET = false;
            }
        }
        public class ConfigModel
        {
            public string USERNAME { get; set; }
            public List<ViewModel> LstAdd { get; set; }
            public List<ViewModel> LstEdit { get; set; }
            public List<ViewModel> LstDelete { get; set; }
        }
    }

}
