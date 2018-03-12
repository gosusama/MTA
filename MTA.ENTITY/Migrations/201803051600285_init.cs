namespace MTA.ENTITY.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AU_DONVI",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MADONVI = c.String(nullable: false, maxLength: 50),
                        MADONVICHA = c.String(maxLength: 50),
                        TENDONVI = c.String(maxLength: 150),
                        SODIENTHOAI = c.String(maxLength: 50),
                        DIACHI = c.String(maxLength: 200),
                        EMAIL = c.String(maxLength: 50),
                        MACUAHANG = c.String(maxLength: 50),
                        TENCUAHANG = c.String(maxLength: 200),
                        URL = c.String(maxLength: 300),
                        TRANGTHAI = c.Int(nullable: false),
                        I_CREATE_DATE = c.DateTime(),
                        I_CREATE_BY = c.String(maxLength: 50),
                        I_UPDATE_DATE = c.DateTime(),
                        I_UPDATE_BY = c.String(maxLength: 50),
                        I_STATE = c.String(maxLength: 50),
                        UNITCODE = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.AU_MENU",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MENUIDCHA = c.String(maxLength: 100),
                        MENUID = c.String(maxLength: 100),
                        TITLE = c.String(maxLength: 200),
                        URL = c.String(maxLength: 500),
                        SORT = c.Int(nullable: false),
                        TRANGTHAI = c.Int(nullable: false),
                        I_CREATE_DATE = c.DateTime(),
                        I_CREATE_BY = c.String(maxLength: 50),
                        I_UPDATE_DATE = c.DateTime(),
                        I_UPDATE_BY = c.String(maxLength: 50),
                        I_STATE = c.String(maxLength: 50),
                        UNITCODE = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.AU_NGUOIDUNG_NHOMQUYEN",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        USERNAME = c.String(nullable: false, maxLength: 50),
                        MANHOMQUYEN = c.String(nullable: false, maxLength: 50),
                        I_CREATE_DATE = c.DateTime(),
                        I_CREATE_BY = c.String(maxLength: 50),
                        I_UPDATE_DATE = c.DateTime(),
                        I_UPDATE_BY = c.String(maxLength: 50),
                        I_STATE = c.String(maxLength: 50),
                        UNITCODE = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.AU_NGUOIDUNG_QUYEN",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        USERNAME = c.String(nullable: false, maxLength: 50),
                        MACHUCNANG = c.String(nullable: false, maxLength: 50),
                        XEM = c.Boolean(nullable: false),
                        THEM = c.Boolean(nullable: false),
                        SUA = c.Boolean(nullable: false),
                        XOA = c.Boolean(nullable: false),
                        DUYET = c.Boolean(nullable: false),
                        TRANGTHAI = c.Int(nullable: false),
                        I_CREATE_DATE = c.DateTime(),
                        I_CREATE_BY = c.String(maxLength: 50),
                        I_UPDATE_DATE = c.DateTime(),
                        I_UPDATE_BY = c.String(maxLength: 50),
                        I_STATE = c.String(maxLength: 50),
                        UNITCODE = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.AU_NGUOIDUNG",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        USERNAME = c.String(nullable: false, maxLength: 50),
                        PASSWORD = c.String(nullable: false, maxLength: 50),
                        MANHANVIEN = c.String(maxLength: 50),
                        TENNHANVIEN = c.String(maxLength: 200),
                        SODIENTHOAI = c.String(maxLength: 20),
                        SOCHUNGMINHTHU = c.String(maxLength: 20),
                        GIOITINH = c.Int(nullable: false),
                        MAPHONG = c.String(maxLength: 50),
                        CHUCVU = c.String(maxLength: 50),
                        LEVEL = c.Int(),
                        TRANGTHAI = c.Int(nullable: false),
                        PARENT_UNITCODE = c.String(maxLength: 50),
                        I_CREATE_DATE = c.DateTime(),
                        I_CREATE_BY = c.String(maxLength: 50),
                        I_UPDATE_DATE = c.DateTime(),
                        I_UPDATE_BY = c.String(maxLength: 50),
                        I_STATE = c.String(maxLength: 50),
                        UNITCODE = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.AU_NHOMQUYEN_CHUCNANG",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MANHOMQUYEN = c.String(nullable: false, maxLength: 50),
                        MACHUCNANG = c.String(nullable: false, maxLength: 50),
                        XEM = c.Boolean(nullable: false),
                        THEM = c.Boolean(nullable: false),
                        SUA = c.Boolean(nullable: false),
                        XOA = c.Boolean(nullable: false),
                        DUYET = c.Boolean(nullable: false),
                        TRANGTHAI = c.Int(nullable: false),
                        I_CREATE_DATE = c.DateTime(),
                        I_CREATE_BY = c.String(maxLength: 50),
                        I_UPDATE_DATE = c.DateTime(),
                        I_UPDATE_BY = c.String(maxLength: 50),
                        I_STATE = c.String(maxLength: 50),
                        UNITCODE = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.AU_NHOMQUYEN",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MANHOMQUYEN = c.String(nullable: false, maxLength: 50),
                        TENNHOMQUYEN = c.String(maxLength: 100),
                        MOTA = c.String(maxLength: 200),
                        TRANGTHAI = c.Int(nullable: false),
                        I_CREATE_DATE = c.DateTime(),
                        I_CREATE_BY = c.String(maxLength: 50),
                        I_UPDATE_DATE = c.DateTime(),
                        I_UPDATE_BY = c.String(maxLength: 50),
                        I_STATE = c.String(maxLength: 50),
                        UNITCODE = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.DM_DAOTAO",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MA_DM = c.String(nullable: false, maxLength: 50),
                        MA_CHA = c.String(maxLength: 50),
                        TEN_DM = c.String(maxLength: 100),
                        NOIDUNG = c.String(),
                        CHITIETNOIDUNG = c.String(),
                        TEPDINHKEM = c.String(maxLength: 200),
                        LOAI_DM = c.Int(nullable: false),
                        DOUUTIEN = c.Int(nullable: false),
                        NGAYTAO = c.DateTime(),
                        NGAYPHATSINH = c.DateTime(),
                        MANGUOITAO = c.String(maxLength: 20),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.DM_GIOITHIEU",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MA_DM = c.String(nullable: false, maxLength: 50),
                        MA_CHA = c.String(maxLength: 50),
                        TEN_DM = c.String(maxLength: 100),
                        NOIDUNG = c.String(),
                        CHITIETNOIDUNG = c.String(),
                        TEPDINHKEM = c.String(maxLength: 200),
                        LOAI_DM = c.Int(nullable: false),
                        DOUUTIEN = c.Int(nullable: false),
                        NGAYTAO = c.DateTime(),
                        NGAYPHATSINH = c.DateTime(),
                        MANGUOITAO = c.String(maxLength: 20),
                        ANH = c.String(maxLength: 200),
                        VIDEO = c.String(maxLength: 200),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.DM_HOPTAC",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MA_DM = c.String(nullable: false, maxLength: 50),
                        MA_CHA = c.String(maxLength: 50),
                        TEN_DM = c.String(maxLength: 100),
                        NOIDUNG = c.String(),
                        CHITIETNOIDUNG = c.String(),
                        TEPDINHKEM = c.String(maxLength: 200),
                        LOAI_DM = c.Int(nullable: false),
                        DOUUTIEN = c.Int(nullable: false),
                        NGAYTAO = c.DateTime(),
                        NGAYPHATSINH = c.DateTime(),
                        MANGUOITAO = c.String(maxLength: 20),
                        ANH = c.String(maxLength: 200),
                        VIDEO = c.String(maxLength: 200),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.DM_TINTUC",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MA_DM = c.String(nullable: false, maxLength: 50),
                        MA_CHA = c.String(maxLength: 50),
                        TEN_DM = c.String(maxLength: 100),
                        NOIDUNG = c.String(),
                        CHITIETNOIDUNG = c.String(),
                        TEPDINHKEM = c.String(maxLength: 200),
                        LOAI_DM = c.Int(nullable: false),
                        DOUUTIEN = c.Int(nullable: false),
                        NGAYTAO = c.DateTime(),
                        NGAYPHATSINH = c.DateTime(),
                        MANGUOITAO = c.String(maxLength: 20),
                        ANH = c.String(maxLength: 200),
                        VIDEO = c.String(maxLength: 200),
                        LUOTXEM = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.DM_TRALOI",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MA_DM = c.String(nullable: false, maxLength: 50),
                        MA_CHA = c.String(maxLength: 50),
                        TEN_DM = c.String(maxLength: 100),
                        NOIDUNG = c.String(),
                        CHITIETNOIDUNG = c.String(),
                        TEPDINHKEM = c.String(maxLength: 200),
                        LOAI_DM = c.Int(nullable: false),
                        DOUUTIEN = c.Int(nullable: false),
                        NGAYTAO = c.DateTime(),
                        NGAYPHATSINH = c.DateTime(),
                        MANGUOITAO = c.String(maxLength: 20),
                        MA_NGUOITRLOI = c.String(maxLength: 50),
                        TEN_NGUOITRALOI = c.String(maxLength: 100),
                        NGAYTRALOI = c.DateTime(),
                        NOIDUNGTRALOI = c.String(),
                        LUOTXEM = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.DM_TUYENSINH",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MA_DM = c.String(nullable: false, maxLength: 50),
                        MA_CHA = c.String(maxLength: 50),
                        TEN_DM = c.String(maxLength: 100),
                        NOIDUNG = c.String(),
                        CHITIETNOIDUNG = c.String(),
                        TEPDINHKEM = c.String(maxLength: 200),
                        LOAI_DM = c.Int(nullable: false),
                        DOUUTIEN = c.Int(nullable: false),
                        NGAYTAO = c.DateTime(),
                        NGAYPHATSINH = c.DateTime(),
                        MANGUOITAO = c.String(maxLength: 20),
                        MAIL_NGUOIHOI = c.String(maxLength: 200),
                        CAUHOI = c.String(),
                        LUOTXEM = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.DM_VANBAN",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MA_DM = c.String(nullable: false, maxLength: 50),
                        MA_CHA = c.String(maxLength: 50),
                        TEN_DM = c.String(maxLength: 100),
                        NOIDUNG = c.String(),
                        CHITIETNOIDUNG = c.String(),
                        TEPDINHKEM = c.String(maxLength: 200),
                        LOAI_DM = c.Int(nullable: false),
                        DOUUTIEN = c.Int(nullable: false),
                        NGAYTAO = c.DateTime(),
                        NGAYPHATSINH = c.DateTime(),
                        MANGUOITAO = c.String(maxLength: 20),
                        NGUOITAO = c.String(maxLength: 200),
                        KICHTHUOC = c.String(maxLength: 20),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.MEDIA",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MA_DM = c.String(nullable: false, maxLength: 50),
                        DOUUTIEN = c.Int(nullable: false),
                        NGAYTAO = c.DateTime(),
                        NGAYPHATSINH = c.DateTime(),
                        MANGUOITAO = c.String(maxLength: 20),
                        MA = c.String(maxLength: 50),
                        TEN_MEDIA = c.String(maxLength: 100),
                        LINK = c.String(maxLength: 200),
                        ANHBIA = c.Boolean(),
                        LOAI_MEDIA = c.Byte(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.MEDIA");
            DropTable("dbo.DM_VANBAN");
            DropTable("dbo.DM_TUYENSINH");
            DropTable("dbo.DM_TRALOI");
            DropTable("dbo.DM_TINTUC");
            DropTable("dbo.DM_HOPTAC");
            DropTable("dbo.DM_GIOITHIEU");
            DropTable("dbo.DM_DAOTAO");
            DropTable("dbo.AU_NHOMQUYEN");
            DropTable("dbo.AU_NHOMQUYEN_CHUCNANG");
            DropTable("dbo.AU_NGUOIDUNG");
            DropTable("dbo.AU_NGUOIDUNG_QUYEN");
            DropTable("dbo.AU_NGUOIDUNG_NHOMQUYEN");
            DropTable("dbo.AU_MENU");
            DropTable("dbo.AU_DONVI");
        }
    }
}
