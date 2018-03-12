using MTA.VIEW.FRONT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MTA.VIEW.FRONT.Controllers
{
    public class HomeController : Controller
    {
        DataContext db = new DataContext();
        public ActionResult Index()
        {

            //Dm_GioiThieu t = db.DM_GIOITHIEU.First();
            //ViewBag.t = t;
            var media = db.MEDIA.Where(md => md.Loai_Media == 0 && md.AnhBia == true).ToList();
            ViewData["img"] = media;
            ViewData["length"] = media.Count();
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}