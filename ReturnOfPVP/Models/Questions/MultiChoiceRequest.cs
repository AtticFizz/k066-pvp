namespace ReturnOfPVP.Models.Questions;

using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Entities;

public class MultiChoiceRequest
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string QuestionText { get; set; }
    [Required]
    public decimal DefaultGrade { get; set; }
    public string? GeneralFeedback { get; set; }
    public string Single { get; set; }
    public bool ShuffleAnswers { get; set; }
    public string AnswerNumbering { get; set; }
    public List<QuestionAnswerRequest> Answers { get; set; }
    public string? CorrectFeedback { get; set; }
    public string? PartiallyCorrectFeedback { get; set; }
    public string? IncorrectFeedback { get; set; }

}
