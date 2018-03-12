using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.SERVICE.Authorize
{
    public class Au_NguoiDungVM
    {
        public class CurrentUser
        {
            public string UnitUser { get; set; }
            public string UserName { get; set; }
            public string MaNhanVien { get; set; }
            public string TenNhanVien { get; set; }
            public string SoDienThoai { get; set; }
            public string ChungMinhThu { get; set; }
            public string GioiTinh { get; set; }
            public string ChucVu { get; set; }
            public string MaPhong { get; set; }
            public string MaMayBan { get; set; }
            public string UnitCode { get; set; }
            public string ParentUnitcode { get; set; }
        }
        public class ModelLogin
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
    }
}
