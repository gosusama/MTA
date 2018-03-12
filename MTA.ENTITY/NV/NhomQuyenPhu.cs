using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.ENTITY.NV
{
    public partial class NhomQuyenPhu
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

        [Key]
        [Column(Order = 3)]
        [StringLength(50)]
        public string Chucnangphu { get; set; }
    }
}
