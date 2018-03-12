using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.ENTITY.NV
{
    [Table("DM_VANBAN")]
    public class Dm_VanBan : DataInfoEntity
    {
        [StringLength(50)]
        [Column("MA_DM")]
        [Required]
        public string Ma_Dm { get; set; }

        [StringLength(50)]
        [Column("MA_CHA")]
        public string Ma_Cha { get; set; }

        [Column("TEN_DM")]
        [StringLength(100)]
        public string Ten_Dm { get; set; }

        [Column("NOIDUNG")]
        public string NoiDung { get; set; }

        [Column("CHITIETNOIDUNG")]
        public string ChiTietNoiDung { get; set; }

        [Column("TEPDINHKEM")]
        [StringLength(200)]
        public string TepDinhKem { get; set; }

        [Column("LOAI_DM")]
        public int Loai_Dm { get; set; }

        [Column("DOUUTIEN")]
        public int DoUuTien { get; set; }

        [Column("NGAYTAO")]
        public DateTime? Ngaytao { get; set; }

        [Column("NGAYPHATSINH")]
        public DateTime? Ngayphatsinh { get; set; }

        [Column("MANGUOITAO")]
        [StringLength(20)]
        public string Manguoitao { get; set; }

        [Column("NGUOITAO")]
        [StringLength(200)]
        public string NguoiTao { get; set; }

        [Column("KICHTHUOC")]
        [StringLength(20)]
        public string KichThuoc { get; set; }
    }
}
