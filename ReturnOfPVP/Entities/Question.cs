namespace ReturnOfPVP.Entities;

using System.Text.Json.Serialization;
using Entities.QuestionTypes;
using Models.Accounts;

public class Question
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string QuestionText { get; set; }
    public string GeneralFeedback { get; set; }
    public decimal DefaultGrade { get; set; }
    public string QType { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Updated { get; set; }
    public int? CreatedById { get; set; }
    public int? UpdatedById { get; set; }
    
    //[JsonIgnore]
    //public List<QuestionAnswer> QuestionAnswers { get; set; }
    public virtual Account? CreatedBy { get; set; }
    public virtual Account? UpdatedBy { get; set; }
    public virtual List<Quiz>? Quizzes { get; set; } = new();
}
