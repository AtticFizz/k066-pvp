using ReturnOfPVP.Models.Accounts;
using ReturnOfPVP.Models.Questions;

namespace ReturnOfPVP.Models;

public class QuizResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Text { get; set; }
    public int TimeLimit { get; set; }
    public int Attempts { get; set; }
    public bool ShuffleQuestions { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Updated { get; set; }

    public AccountResponse CreatedBy { get; set; }
    public AccountResponse? UpdatedBy { get; set; }
    public List<object> Questions { get; set; }
}
