namespace ReturnOfPVP.Models.Questions;

using Entities;

public class MultiChoiceResponse : QuestionResponse
{
    public bool Single { get; set; }
    public bool ShuffleAnswers { get; set; }
    public string AnswerNumbering { get; set; }
    public List<QuestionAnswer> QuestionAnswers { get; set; }
    public string? CorrectFeedback { get; set; }
    public string? PartiallyCorrectFeedback { get; set; }
    public string? IncorrectFeedback { get; set; }
}
