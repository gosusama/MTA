﻿using MTA.SERVICE.BuildQuery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MTA.SERVICE.Services
{
    public interface IDataSearch
    {
        string DefaultOrder { get; }
        void LoadGeneralParam(string summary);
        List<IQueryFilter> GetFilters();
        
        List<IQueryFilter> GetQuickFilters();
    }
}