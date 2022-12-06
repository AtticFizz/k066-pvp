namespace ReturnOfPVP.Entities;

using System.ComponentModel.DataAnnotations;

public class Quiz
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    public string? Text { get; set; }
    [Required]
    public int TimeLimit { get; set; }
    public int Attempts { get; set; }
    public bool ShuffleQuestions { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Updated { get; set; }
    public int? CreatedById { get; set; }
    public int? UpdatedById { get; set; }

    public virtual Account? CreatedBy { get; set; }
    public virtual Account? UpdatedBy { get; set; }
    public virtual List<Question> Questions { get; set; } = new();

}
