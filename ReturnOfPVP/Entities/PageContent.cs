using System.ComponentModel.DataAnnotations;

namespace ReturnOfPVP.Entities;
public class PageContent
{
    public int Id { get; set; }
    [Required]
    public Page PageName { get; set; }
    [Required]
    public string Content { get; set; }
    public DateTime Updated { get; set; }
}
