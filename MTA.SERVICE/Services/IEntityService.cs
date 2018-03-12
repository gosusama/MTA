using MTA.ENTITY;
using MTA.SERVICE.BuildQuery;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;


namespace MTA.SERVICE.Services
{
    public interface IEntityService<TEntity> : IService
        where TEntity : EntityBase
    {
        IRepository<TEntity> Repository { get; }
        List<Expression<Func<TEntity, object>>> Includes { get; }

        IEntityService<TEntity> Include(Expression<Func<TEntity, object>> include);

        ResultObj<PagedObj<TEntity>> Filter<TSearch>(
        FilterObj<TSearch> filtered,
        IQueryBuilder query = null)
        where TSearch : IDataSearch;

    }
}