using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.ENTITY.NV
{
    public partial class MenuNhomQuyen
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(20)]
        public string Manhomquyen { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string Menuid { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(20)]
        public string Madonvi { get; set; }

        public bool? Them { get; set; }

        public bool? Sua { get; set; }

        public bool? Xoa { get; set; }

        public bool? Luutam { get; set; }

        public bool? Luuthuc { get; set; }

        public bool? Khoiphuc { get; set; }

        public bool? Xem { get; set; }

        [Required]
        [StringLength(20)]
        public string Manguoitao { get; set; }

        public DateTime Ngaytao { get; set; }
    }
}
