namespace ReturnOfPVP.Entities.QuestionTypes;

using System.Text.Json.Serialization;

public class QuestionTrueFalse : Question
{
    public virtual List<QuestionAnswer> QuestionAnswers { get; set; } = new List<QuestionAnswer>();
}
