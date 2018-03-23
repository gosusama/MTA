using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.ENTITY.NV
{
    [Table("LOAI_TINTUC")]
    public class Dm_LoaiTinTuc : DataInfoEntity
    {
        [StringLength(50)]
        [Column("MA_LOAITINTUC")]
        [Required]
        public string Ma_LoaiTinTuc { get; set; }
        [Column("TEN_LOAITINTUC")]
        [StringLength(100)]
        public string Ten_LoaiTinTuc { get; set; }
        [Column("NGAYTAO")]
        public DateTime? Ngaytao { get; set; }
    }
}
