using MTA.VIEW.FRONT.Models.DatabaseContext;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.VIEW.FRONT.Models
{
    public class DataContext : DbContext
    {
        public DataContext() : base("name=MTA.Connection")
        {

        }

        static void Main(string[] args)
        {
        }

        //DM
        public virtual DbSet<Dm_DaoTao> DM_DAOTAO { get; set; }
        public virtual DbSet<Dm_GioiThieu> DM_GIOITHIEU { get; set; }
        public virtual DbSet<Dm_HopTac> DM_HOPTAC { get; set; }
        public virtual DbSet<Dm_TinTuc> DM_TINTUC { get; set; }
        public virtual DbSet<Dm_TraLoi> DM_TRALOI { get; set; }
        public virtual DbSet<Dm_TuyenSinh> DM_TUYENSINH { get; set; }
        public virtual DbSet<Dm_VanBan> DM_VANBAN { get; set; }
        public virtual DbSet<Media> MEDIA { get; set; }
        //
    }
}
