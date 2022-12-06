namespace ReturnOfPVP.Models.Questions;

using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

public class TrueFalseRequest
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string QuestionText { get; set; }
    [Required]
    public decimal DefaultGrade { get; set; }
    public string? GeneralFeedback { get; set; }
    [Required]
    public string? Answer { get; set; }
    public string? TrueFeedback { get; set; }
    public string? FalseFeedback { get; set; }

}
