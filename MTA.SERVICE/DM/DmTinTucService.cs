using MTA.ENTITY.NV;
using MTA.SERVICE.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace MTA.SERVICE.DM
{
    public interface IDmTinTucService : IDataInfoService<Dm_TinTuc>
    {
        string UploadImage();
    }

    public class DmTinTucService : DataInfoServiceBase<Dm_TinTuc>, IDmTinTucService
    {
        public DmTinTucService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
        public string UploadImage()
        {
            string result = string.Empty; ;
            try
            {
                string path = "C:\\Users\\Administrator\\Desktop\\MTA\\MTA\\MTA.VIEW.FRONT\\Upload\\";

                HttpRequest request = HttpContext.Current.Request;
                var ma_Dm = request.Form["ma_Dm"];
                path += ma_Dm + "\\";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                try
                {
                    for (int i = 0; i < request.Files.Count; i++)
                    {
                        HttpPostedFile file = request.Files[i];
                        List<string> tmp = file.FileName.Split('.').ToList();
                        string extension = tmp[1];
                        //file.ContentType
                        string fileName = string.Format("{0}_{1}{2}{3}.{4}", ma_Dm, DateTime.Now.Minute, DateTime.Now.Second,
                                                                                        DateTime.Now.Millisecond, extension);
                        file.SaveAs(path + fileName);
                        result += path + fileName + ",";
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
