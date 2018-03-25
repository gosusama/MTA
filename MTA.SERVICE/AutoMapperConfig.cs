using AutoMapper;
using BTS.API.SERVICE.Helper;
using MTA.ENTITY;
using MTA.ENTITY.NV;
using MTA.SERVICE.BuildQuery;
using System;
using System.Web;

namespace MTA.SERVICE
{
    public static class AutoMapperConfig
    {
        public static void Config()
        {
            Mapper.CreateMap(typeof(PagedObj), typeof(PagedObj));
            Mapper.CreateMap(typeof(PagedObj<>), typeof(PagedObj<>));
            Nv();
            Authorize();
            Dcl();
            MD();
        }
        public static void MD()
        {
            // dm loại tin tức
            Mapper.CreateMap<Dm_LoaiTinTuc, ChoiceObj>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Ma_LoaiTinTuc))
            .ForMember(dest => dest.Text, opt => opt.MapFrom(src => string.Format("[{0}]-{1}", src.Ma_LoaiTinTuc, src.Ten_LoaiTinTuc)))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Ten_LoaiTinTuc))
            .ForMember(dest => dest.Selected, opt => opt.UseValue(false))
            .ForMember(dest => dest.OldSelected, opt => opt.UseValue(true));
        }
        public static void Nv()
        {

        }
        public static void Dcl()
        {

        }
        public static void Authorize()
        {
            //Au Người dùng

        }
        public static IMappingExpression<TSource, TDestination> IgnoreDataInfoSelfMapping<TSource, TDestination>(
           this IMappingExpression<TSource, TDestination> map)
           where TSource : DataInfoEntity
           where TDestination : DataInfoEntity
        {
            map.ForMember(dest => dest.ICreateDate, config => config.Ignore());
            map.ForMember(dest => dest.ICreateBy, config => config.Ignore());
            map.ForMember(dest => dest.UnitCode, config => config.Ignore());
            map.AfterMap((src, dest) =>
            {
                if (string.IsNullOrEmpty(dest.ICreateBy) && dest.ICreateDate == null)
                {
                    if (HttpContext.Current != null && HttpContext.Current.User.Identity.IsAuthenticated)
                        dest.ICreateBy = HttpContext.Current.User.Identity.Name;
                    dest.ICreateDate = DateTime.Now;
                }
            });
            return map;
        }
        public static IMappingExpression<TSource, TDestination> IgnoreDataInfo<TSource, TDestination>(
          this IMappingExpression<TSource, TDestination> map)
            where TSource : DataDto
            where TDestination : DataInfoEntity
        {
            map.ForMember(dest => dest.ICreateDate, config => config.Ignore());
            map.ForMember(dest => dest.ICreateBy, config => config.Ignore());
            map.ForMember(dest => dest.IUpdateDate,
                config => config.ResolveUsing<UpdateDateResolver>().FromMember(x => x.IUpdateDate));
            map.ForMember(dest => dest.IUpdateBy,
                config => config.ResolveUsing<UpdateByResolver>().FromMember(x => x.IUpdateBy));
            map.ForMember(dest => dest.IState, config => config.Ignore());
            map.AfterMap((src, dest) =>
            {
                if (string.IsNullOrEmpty(dest.ICreateBy) && dest.ICreateDate == null)
                {
                    if (HttpContext.Current != null && HttpContext.Current.User.Identity.IsAuthenticated)
                        dest.ICreateBy = HttpContext.Current.User.Identity.Name;
                    dest.ICreateDate = DateTime.Now;
                }
            });
            return map;
        }

        public class IdResolver : ValueResolver<string, string>
        {
            protected override string ResolveCore(string source)
            {
                return Guid.NewGuid().ToString();
            }
        }

        public class UpdateDateResolver : ValueResolver<DateTime?, DateTime?>
        {
            protected override DateTime? ResolveCore(DateTime? source)
            {
                return DateTime.Now;
            }
        }

        public class UpdateByResolver : ValueResolver<string, string>
        {
            protected override string ResolveCore(string source)
            {
                var result = source;
                if (HttpContext.Current != null && HttpContext.Current.User.Identity.IsAuthenticated)
                    result = HttpContext.Current.User.Identity.Name;
                return result;
            }
        }
    }
}