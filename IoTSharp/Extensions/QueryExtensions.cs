using IoTSharp.Controllers.Models;
using IoTSharp.EasyEFQuery;
using IoTSharp.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace IoTSharp.Extensions
{

    public static class QueryExtensions
    {
        /// <summary>
        /// Paging query
        /// </summary>
        /// <typeparam name="T">Original table type</typeparam>
        /// <param name="_dto">Basic query conditions</param>
        /// <param name="src">Query source</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public static async Task<PagedData<T>> Query<T>(this QueryDto _dto, IQueryable<T> src, CancellationToken cancellationToken = default(CancellationToken)) where T : class
        {
            var _total = await src.CountAsync(cancellationToken);
            var query = src.Skip((_dto.Offset) * _dto.Limit)
                          .Take(_dto.Limit);
            var rs = await query.ToListAsync(cancellationToken);
            var data = new PagedData<T>
            {
                total = _total,
                rows = rs
            };
            return data;
        }
        /// <summary>
        /// Paging query
        /// </summary>
        /// <typeparam name="T">Original table type</typeparam>
        /// <param name="_dto">Basic query conditions</param>
        /// <param name="src">Query source</param>
        /// <param name="_where">Additional query conditions</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public static async Task<PagedData<T>> Query<T>(this QueryDto _dto, IQueryable<T> src, Expression<Func<T, bool>> _where, CancellationToken cancellationToken = default(CancellationToken)) where T : class
        {
            var _total = await src.CountAsync(_where, cancellationToken);
            var query = src.Where(_where).Skip((_dto.Offset) * _dto.Limit)
                          .Take(_dto.Limit);
            var rs = await query.ToListAsync(cancellationToken);
            var data = new PagedData<T>
            {
                total = _total,
                rows = rs
            };

            return data;
        }
        /// <summary>
        /// Paging query
        /// </summary>
        /// <typeparam name="T">Original table type</typeparam>
        /// <typeparam name="P">Query name field type</typeparam>
        /// <param name="_dto">Basic query conditions</param>
        /// <param name="src">Query source</param>
        /// <param name="func">Specify the field corresponding to the Name query in the query condition</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public static async Task<PagedData<T>> Query<T, P>(this QueryDto _dto, IQueryable<T> src, Expression<Func<T, P>> func, CancellationToken cancellationToken = default(CancellationToken)) where T : class
        {
            var _where = MemberToExpression(_dto, func);
            if (_where!=null)
            {
                return await _dto.Query(src, _where, cancellationToken);
            }
            else
            {
                return await _dto.Query(src, cancellationToken);
            }
        }

        private static Expression<Func<T, bool>> MemberToExpression<T, P>(QueryDto _dto, Expression<Func<T, P>> func) where T : class
        {
            var member = (MemberExpression)func.Body;
            var queries = new QueryCollection
            {
                new Query { Name = member.Member.Name, Operator =Operators.StartWith, Value = _dto.Name },
                new Query { Name = member.Member.Name, Operator =Operators.Contains, Value = _dto.Name },
                new Query { Name = member.Member.Name, Operator = Operators.EndWidth, Value = _dto.Name }
            };
            var _where = queries.AsExpression<T>();
            return _where;
        }

        /// <summary>
        /// Paging query
        /// </summary>
        /// <typeparam name="T">Original table type</typeparam>
        /// <typeparam name="P">Query name field type</typeparam>
        /// <param name="_dto">Basic query conditions</param>
        /// <param name="src">Query source</param>
        /// <param name="func">Specify the field corresponding to the Name query in the query condition</param>
        /// <param name="_where">Additional query conditions</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public static async Task<PagedData<T>> Query<T, P>(this QueryDto _dto, IQueryable<T> src, Expression<Func<T, bool>> _where, Expression<Func<T, P>> func, CancellationToken cancellationToken = default(CancellationToken)) where T : class
        {
            _where = _where.WithNameQuery(_dto, func);
            var _total = await src.CountAsync(_where, cancellationToken);
            var query = src.Where(_where).Skip((_dto.Offset) * _dto.Limit)
                          .Take(_dto.Limit);
            var rs = await query.ToListAsync(cancellationToken);
            var data = new PagedData<T>
            {
                total = _total,
                rows = rs
            };
            return data;
        }

        /// <summary>
        /// Paging query
        /// </summary>
        /// <typeparam name="T">Original table type</typeparam>
        /// <typeparam name="P">Query name field type</typeparam>
        /// <typeparam name="R">Convert the queried data to the specified type</typeparam>
        /// <param name="_dto">Basic query conditions</param>
        /// <param name="src">Query source</param>
        /// <param name="func">Specify the field corresponding to the Name query in the query condition</param>
        /// <param name="_where">Additional query conditions</param>
        /// <param name="conver">Convert the queried data to the specified expression</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public static async Task<PagedData<R>> Query<T, R, P>(this QueryDto _dto, IQueryable<T> src, Expression<Func<T, bool>> _where, Expression<Func<T, P>> func, Expression<Func<T, R>> conver, CancellationToken cancellationToken = default(CancellationToken)) where T : class
        {
            _where = _where.WithNameQuery(_dto, func);
            var _total = await src.CountAsync(_where, cancellationToken);
            var query = src.Where(_where).Skip((_dto.Offset) * _dto.Limit)
                          .Take(_dto.Limit);
            var data = new PagedData<R>
            {
                total = _total,
            };
            List<R> rs = new List<R>();
            rs = await query.Select(conver).ToListAsync(cancellationToken);
            data.rows = rs;
            return data;
        }

        private static Expression<Func<T, bool>> WithNameQuery<T, P>(this Expression<Func<T, bool>> _where, QueryDto _dto, Expression<Func<T, P>> func) where T : class
        {
            if (!string.IsNullOrEmpty(_dto.Name))
            {
                var member = (MemberExpression)func.Body;
                var queries = new QueryCollection
                 {
                     new Query { Name = member.Member.Name, Operator =Operators.StartWith, Value = _dto.Name },
                     new Query { Name = member.Member.Name, Operator =Operators.Contains, Value = _dto.Name },
                     new Query { Name = member.Member.Name, Operator = Operators.EndWidth, Value = _dto.Name }
                 };
                _where = _where.AndWith(queries);
            }

            return _where;
        }
    }
}
