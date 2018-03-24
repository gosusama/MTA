namespace MTA.ENTITY.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updateMedia : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.MEDIA", "ANHBIA", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.MEDIA", "ANHBIA", c => c.Boolean());
        }
    }
}
