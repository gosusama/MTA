using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MTA.ENTITY;

namespace MTA.SERVICE.Repository
{
    public class DbFactory : Disposable, IDbFactory
    {
        MTADbContext dbContext;
        public MTADbContext Init()
        {
            return dbContext ?? (dbContext = new MTADbContext());
        }
        protected override void DisposeCore()
        {
            if(dbContext != null)
            {
                dbContext.Dispose();
            }
        }
    }
}
