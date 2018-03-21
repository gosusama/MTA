using MTA.ENTITY.Authorize;
using MTA.ENTITY.NV;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.ENTITY
{
    public class MTADbContext : DataContext
    {
        public MTADbContext() : base("name=MTA.Connection")
        {
            Configuration.LazyLoadingEnabled = true;
            Database.SetInitializer<MTADbContext>(new CreateDatabaseIfNotExists<MTADbContext>());
        }
        //AU
        public virtual DbSet<AU_MENU> AU_MENUs { get; set; }
        public virtual DbSet<AU_DONVI> AU_DONVIs { get; set; }
        public virtual DbSet<AU_NGUOIDUNG> AU_NGUOIDUNGs { get; set; }
        public virtual DbSet<AU_NGUOIDUNG_NHOMQUYEN> AU_NGUOIDUNG_NHOMQUYENs { get; set; }
        public virtual DbSet<AU_NGUOIDUNG_QUYEN> AU_NGUOIDUNG_QUYENs { get; set; }
        public virtual DbSet<AU_NHOMQUYEN> AU_NHOMQUYENs { get; set; }
        public virtual DbSet<AU_NHOMQUYEN_CHUCNANG> AU_NHOMQUYEN_CHUCNANGs { get; set; }
        //
        //DM
        public virtual DbSet<Dm_DaoTao> DM_DAOTAO { get; set; }
        public virtual DbSet<Dm_GioiThieu> DM_GIOITHIEU { get; set; }
        public virtual DbSet<Dm_HopTac> DM_HOPTAC { get; set; }
        public virtual DbSet<Dm_TinTuc> DM_TINTUC { get; set; }
        public virtual DbSet<Dm_TraLoi> DM_TRALOI { get; set; }
        public virtual DbSet<Dm_TuyenSinh> DM_TUYENSINH { get; set; }
        public virtual DbSet<Dm_VanBan> DM_VANBAN { get; set; }
        public virtual DbSet<Media> MEDIA { get; set; }
        public virtual DbSet<Dm_NghienCuu> DM_NghienCuu {get;set;}
        //
    }
}
