﻿using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MTA.ENTITY.Authorize
{
    [Table("AU_NHOMQUYEN")]
    public class AU_NHOMQUYEN : DataInfoEntity
    {

        [StringLength(50)]
        [Required]
        public string MANHOMQUYEN { get; set; }

        [StringLength(100)]
        public string TENNHOMQUYEN { get; set; }

        [StringLength(200)]
        public string MOTA { get; set; }

        [Description("1: sudung | 0 : khongsudung")]
        public int TRANGTHAI { get; set; }
    }
}
