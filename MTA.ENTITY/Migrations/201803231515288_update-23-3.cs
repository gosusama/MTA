namespace MTA.ENTITY.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class update233 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.LOAI_TINTUC",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 50),
                        MA_LOAITINTUC = c.String(nullable: false, maxLength: 50),
                        TEN_LOAITINTUC = c.String(maxLength: 100),
                        NGAYTAO = c.DateTime(),
                        I_CREATE_DATE = c.DateTime(),
                        I_CREATE_BY = c.String(maxLength: 50),
                        I_UPDATE_DATE = c.DateTime(),
                        I_UPDATE_BY = c.String(maxLength: 50),
                        I_STATE = c.String(maxLength: 50),
                        UNITCODE = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.ID);
            
            AlterColumn("dbo.DM_DAOTAO", "LOAI_DM", c => c.String());
            AlterColumn("dbo.DM_TINTUC", "LOAI_DM", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.DM_TINTUC", "LOAI_DM", c => c.Int(nullable: false));
            AlterColumn("dbo.DM_DAOTAO", "LOAI_DM", c => c.Int(nullable: false));
            DropTable("dbo.LOAI_TINTUC");
        }
    }
}
