namespace ReturnOfPVP.Models;

using ReturnOfPVP.Entities;
using ReturnOfPVP.Models.Questions;
using System.ComponentModel.DataAnnotations;

public class QuizRequest
{
    [Required]
    public string Name { get; set; }
    public string Text { get; set; }
    [Required]
    public int TimeLimit { get; set; }
    public bool ShuffleQuestions { get; set; }

    public List<int> Questions { get; set; }
}
