
using System.ComponentModel.DataAnnotations.Schema;

namespace MTA.FRONT.Models
{
    public interface IObjectState
    {
        [NotMapped]
        ObjectState ObjectState { get; set; }
    }
}