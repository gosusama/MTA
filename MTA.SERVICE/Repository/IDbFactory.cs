using MTA.ENTITY;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.SERVICE.Repository
{
    public interface IDbFactory : IDisposable
    {
        MTADbContext Init();
    }
}
