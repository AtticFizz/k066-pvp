namespace ReturnOfPVP.Entities;

using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

public class QuestionAnswer
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    [Required]
    public string Answer { get; set; }
    [Required]
    public string Fraction { get; set; }
    public string Feedback { get; set; }

    [JsonIgnore]
    public virtual Question Question { get; set; }
}
