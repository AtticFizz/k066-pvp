using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReturnOfPVP.Authorization;
using ReturnOfPVP.Entities;
using ReturnOfPVP.Helpers;
using ReturnOfPVP.Models;
using ReturnOfPVP.Models.Questions;

namespace ReturnOfPVP.Controllers;

[Authorize(Role.Admin)]
[Route("api/[controller]")]
[ApiController]
public class QuizController : BaseController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public QuizController(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [AllowAnonymous]
    [HttpGet]
    public ActionResult<List<QuizResponse>> GetQuizzes()
    {
        var quizzes = _context.Quizzes.ToList();
        var response = _mapper.Map<List<QuizResponse>>(quizzes);
        for (int i = 0; i < response.Count; i++)
        {
            var questions = _mapper.Map<List<QuestionResponse>>(quizzes[i].Questions);
            response[i].Questions = questions.Cast<object>().ToList();
        }
        return response;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuizResponse>> GetQuiz(int id)
    {
        var quiz = await _context.Quizzes.FindAsync(id);
        if (quiz == null)
            return NotFound();

        var response = _mapper.Map<QuizResponse>(quiz);
        var questions = _mapper.Map<List<QuestionResponse>>(quiz.Questions);
        response.Questions = questions.Cast<object>().ToList();
        return response;
    }

    [HttpPost]
    public async Task<QuizResponse> PostQuiz(QuizRequest request)
    {
        var quiz = _mapper.Map<Quiz>(request);
        quiz.Attempts = 0;
        quiz.Created = DateTime.UtcNow;
        quiz.Updated = DateTime.UtcNow;
        quiz.CreatedBy = Account;
        quiz.UpdatedBy = Account;

        foreach (var qId in request.Questions)
        {
            var question = await _context.Questions.FindAsync(qId);
            quiz.Questions.Add(question);
        }

        await _context.Quizzes.AddAsync(quiz);
        await _context.SaveChangesAsync();

        return _mapper.Map<QuizResponse>(quiz);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<QuizResponse>> PutQuiz(QuizRequest request, int id)
    {
        var quiz = _mapper.Map<Quiz>(await _context.Quizzes.FindAsync(id));
        quiz = _mapper.Map(request, quiz);

        quiz.Updated = DateTime.UtcNow;
        quiz.UpdatedBy = Account;

        quiz.Questions.Clear();

        foreach (var qId in request.Questions)
        {
            var question = await _context.Questions.FindAsync(qId);
            quiz.Questions.Add(question);
        }

        await _context.SaveChangesAsync();

        return _mapper.Map<QuizResponse>(quiz);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuiz(int id)
    {
        var quiz = await _context.Quizzes.FindAsync(id);
        if (quiz == null)
            return NotFound();

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
