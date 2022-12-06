namespace ReturnOfPVP.Models.Questions;

using Entities;

public class TrueFalseResponse : QuestionResponse
{
    public List<QuestionAnswer> QuestionAnswers { get; set; }
}
