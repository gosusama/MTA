using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.ENTITY.NV
{
    public class Menu
    {
        [Key]
        [Column("MENUID",Order = 0)]
        [StringLength(50)]
        public string Menuid { get; set; }

        [Key]
        [Column("MADONVI",Order = 1)]
        [StringLength(20)]
        public string Madonvi { get; set; }

        [Column("MENUNAME")]
        [StringLength(150)]
        public string Menuname { get; set; }

        [Column("MENUCHA")]
        [StringLength(20)]
        public string Menucha { get; set; }

        [Column("THUTU")]
        public int? Thutu { get; set; }

        [Column("FORMNAME")]
        [StringLength(30)]
        public string Formname { get; set; }
        
        [Column("LOAIMENU")]
        public int? Loaimenu { get; set; }

        [Column("THAMSO")]
        [StringLength(20)]
        public string Thamso { get; set; }

        [Column("CAP")]
        public int? Cap { get; set; }
    }
}
