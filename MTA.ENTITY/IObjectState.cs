
using System.ComponentModel.DataAnnotations.Schema;

namespace MTA.ENTITY
{
    public interface IObjectState
    {
        [NotMapped]
        ObjectState ObjectState { get; set; }
    }
}