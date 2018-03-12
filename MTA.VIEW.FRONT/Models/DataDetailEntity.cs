using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MTA.VIEW.FRONT.Models
{
    public class DataDetailEntity : EntityBase
    {
        [Key]
        [Column("ID")]
        [StringLength(50)]
        public string Id { get; set; }
    }
}
