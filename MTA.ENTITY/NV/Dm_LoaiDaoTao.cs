using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.ENTITY.NV
{
    [Table("LOAI_DAOTAO")]
    public class Dm_LoaiDaoTao : DataInfoEntity
    {
        [StringLength(50)]
        [Column("MA_LOAIDAOTAO")]
        [Required]
        public string Ma_LoaiDaoTao { get; set; }
        [Column("TEN_LOAIDAOTAO")]
        [StringLength(100)]
        public string Ten_LoaiDaoTao { get; set; }
        [Column("NGAYTAO")]
        public DateTime? Ngaytao { get; set; }
    }
}
