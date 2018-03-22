using MTA.ENTITY.NV;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;

namespace MTA.SERVICE.NV
{
    public interface IMediaService : IDataInfoService<Media>
    {
        bool Upload(string unitCode);
        bool DeleteFile(string path);
    }
    public class MediaService : DataInfoServiceBase<Media>, IMediaService
    {
        public MediaService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
        public bool Upload(string unitCode)
        {
            string result = "";
            try
            {
                string path =  WebConfigurationManager.AppSettings["rootPhysical"] + "\\Upload\\";
                HttpRequest request = HttpContext.Current.Request;
                var ma_Dm = request.Form["ma_Dm"];               
                path += ma_Dm + "\\";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                try
                {
                    if(request.Files.Count > 1)
                    {
                        for (int i = 0; i < request.Files.Count; i++)
                        {
                            result = "";
                            HttpPostedFile file = request.Files[i];
                            List<string> tmp = file.FileName.Split('.').ToList();
                            string extension = tmp[1];
                            string name = request.Form["flag"];
                            //file.ContentType
                            string fileName = string.Format("{0}_{1}{2}{3}.{4}", name, DateTime.Now.Minute, DateTime.Now.Second,
                                                                                            DateTime.Now.Millisecond, extension);
                            file.SaveAs(path + fileName);
                            result += path + fileName;
                            Media instance = new Media()
                            {
                                Ma_Dm = i.ToString() + "-" + getNewCode(),
                                Id = Guid.NewGuid().ToString(),
                                MaCha = ma_Dm,
                                Ten_Media = fileName,
                                DoUuTien = 100,
                                Loai_Media = Convert.ToByte(request.Form["loai_Media"]),
                                Link = result,
                                UnitCode = unitCode,
                                ICreateDate = DateTime.Now,
                                AnhBia = request.Form["anhBia["+i+"]"] == "true" ? 10 : 0
                            };
                            UnitOfWork.Repository<Media>().Insert(instance);
                        }
                    }
                    else if(request.Files.Count == 1)
                    {
                        result = "";
                        HttpPostedFile file = request.Files[0];
                        List<string> tmp = file.FileName.Split('.').ToList();
                        string extension = tmp[1];
                        string name = request.Form["flag"];
                        //file.ContentType
                        string fileName = string.Format("{0}_{1}{2}{3}.{4}", name, DateTime.Now.Minute, DateTime.Now.Second,
                                                                                        DateTime.Now.Millisecond, extension);
                        file.SaveAs(path + fileName);
                        result += path + fileName;
                        Media instance = new Media()
                        {
                            Ma_Dm = getNewCode(),
                            Id = Guid.NewGuid().ToString(),
                            MaCha = ma_Dm,
                            Ten_Media = fileName,
                            DoUuTien = 100,
                            Loai_Media = Convert.ToByte(request.Form["loai_Media"]),
                            Link = result,
                            UnitCode = unitCode,
                            ICreateDate = DateTime.Now,
                            AnhBia = request.Form["anhBia[0]"] == "true" ? 10 : 0 
                        };
                        UnitOfWork.Repository<Media>().Insert(instance);
                    }
                    UnitOfWork.Save();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                if(result!= "")
                {
                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public string getNewCode()
        {
            string maCuoi = UnitOfWork.Repository<Media>().DbSet.OrderByDescending(x => x.Ma_Dm).Select(x => x.Ma_Dm).FirstOrDefault();
            if (maCuoi == null)
            {
                return "MD_1";
            }
            else
            {
                string[] str = maCuoi.Split('_');
                int temp = Convert.ToInt16(str[1]);
                return "MD_" + (++temp).ToString();
            }
        }

        public bool DeleteFile(string path)
        {
            try
            {
                File.Delete(path);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
