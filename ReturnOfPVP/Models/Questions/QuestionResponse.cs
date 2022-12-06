namespace ReturnOfPVP.Models.Questions;

using Models.Accounts;

public class QuestionResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string QuestionText { get; set; }
    public string GeneralFeedback { get; set; }
    public decimal DefaultGrade { get; set; }
    public string QType { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Updated { get; set; }

    public AccountResponse CreatedBy { get; set; }
    public AccountResponse? UpdatedBy { get; set; }
}
