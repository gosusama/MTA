using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.VIEW.FRONT.Models.DatabaseContext
{
    [Table("MEDIA")]
    public class Media: DataDetailEntity
    {
        [StringLength(50)]
        [Column("MA_DM")]
        [Required]
        public string Ma_Dm { get; set; }
        [Column("DOUUTIEN")]
        public int DoUuTien { get; set; }

        [Column("NGAYTAO")]
        public DateTime? Ngaytao { get; set; }

        [Column("NGAYPHATSINH")]
        public DateTime? Ngayphatsinh { get; set; }

        [Column("MANGUOITAO")]
        [StringLength(20)]
        public string Manguoitao { get; set; }
        [Column("MA")]
        [StringLength(50)]
        public string Ma { get; set; }

        [Column("TEN_MEDIA")]
        [StringLength(100)]
        public string Ten_Media { get; set; }

        [Column("LINK")]
        [StringLength(200)]
        public string Link { get; set; }

        [Column("ANHBIA")]
        public bool? AnhBia { get; set; }
        
        [Column("LOAI_MEDIA")]
        public byte Loai_Media { get; set; }
        
    }
}
