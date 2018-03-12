using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.ENTITY
{
    public class BaseEntity
    {
        [Column("ID")]
        [StringLength(50)]
        public string ID { get; set; }
    }
}
