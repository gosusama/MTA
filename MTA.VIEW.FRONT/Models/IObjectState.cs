
using System.ComponentModel.DataAnnotations.Schema;

namespace MTA.VIEW.FRONT.Models
{
    public interface IObjectState
    {
        [NotMapped]
        ObjectState ObjectState { get; set; }
    }
}