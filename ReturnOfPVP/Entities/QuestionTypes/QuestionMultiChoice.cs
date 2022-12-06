namespace ReturnOfPVP.Entities.QuestionTypes;

using System.Text.Json.Serialization;

public class QuestionMultiChoice : Question
{
    public bool Single { get; set; } // A flag signaling, whether only one option or multiple options can be chosen.
    public bool ShuffleAnswers { get; set; } // A flag that determines whether the answers should be shuffled, provided the quiz settings allows this.
    public string CorrectFeedback { get; set; }
    public string PartiallyCorrectFeedback { get; set; }
    public string IncorrectFeedback { get; set; }
    public string AnswerNumbering { get; set; }

    public virtual List<QuestionAnswer> QuestionAnswers { get; set; } = new List<QuestionAnswer>();
}
