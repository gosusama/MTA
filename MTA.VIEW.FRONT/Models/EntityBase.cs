using System.ComponentModel.DataAnnotations.Schema;

namespace MTA.VIEW.FRONT.Models
{
    public abstract class EntityBase : IObjectState
    {
        [NotMapped]
        public ObjectState ObjectState { get; set; } //TODO: Renamed since a possible coflict with State entity column
    }
}