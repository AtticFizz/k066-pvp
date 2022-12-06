using ReturnOfPVP.Entities;
using System.ComponentModel.DataAnnotations;

namespace ReturnOfPVP.Models
{
    public class EditorContentRequest
    {
        [Required]
        public string Content { get; set; }
    }
}
