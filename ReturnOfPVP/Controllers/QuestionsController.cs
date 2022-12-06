namespace ReturnOfPVP.Controllers;

using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReturnOfPVP.Authorization;
using ReturnOfPVP.Entities;
using ReturnOfPVP.Entities.QuestionTypes;
using ReturnOfPVP.Helpers;
using ReturnOfPVP.Models;
using ReturnOfPVP.Models.Accounts;
using ReturnOfPVP.Models.Questions;
using ReturnOfPVP.Services;
using System.Xml.Linq;
using HtmlAgilityPack;

[Authorize(Role.Admin)]
[Route("api/[controller]")]
[ApiController]
public class QuestionsController : BaseController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly IWebHostEnvironment _hostEnvironment;

    public QuestionsController(DataContext context, IMapper mapper, IWebHostEnvironment hostEnvironment)
    {
        _context = context;
        _mapper = mapper;
        _hostEnvironment = hostEnvironment;
    }

    [HttpGet]
    public List<object> GetQuestions()
    {
        var questions = _mapper.Map<List<QuestionResponse>>(_context.Questions.ToList());
        // Cast to object to serialize derived properties
        return questions.Cast<object>().ToList();
    }

    [HttpGet("{id}")]
    public object GetQuestion(int id)
    {
        var question = _context.Questions.Find(id);
        if (question == null)
            return NotFound();

        return _mapper.Map<QuestionResponse>(question);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteQuestion(int id)
    {
        var question = _context.Questions.Find(id);
        if (question == null)
            return NotFound();

        _context.Questions.Remove(question);
        _context.SaveChanges();

        return Ok();
    }

    [HttpPost("truefalse")]
    public TrueFalseResponse CreateTrueFalseQuestion(TrueFalseRequest request)
    {
        var question = _mapper.Map<QuestionTrueFalse>(request);
        question.QType = "truefalse";
        question.Created = DateTime.UtcNow;
        question.Updated = DateTime.UtcNow;
        question.CreatedBy = Account;
        question.UpdatedBy = Account;

        var trueAnswer = new QuestionAnswer();
        trueAnswer.Answer = "Tiesa";
        trueAnswer.Fraction = request.Answer == "true" ? "1" : "0";
        trueAnswer.Feedback = request.TrueFeedback;
        trueAnswer.Question = question;
        question.QuestionAnswers.Add(trueAnswer);

        var falseAnswer = new QuestionAnswer();
        falseAnswer.Answer = "Netiesa";
        falseAnswer.Fraction = request.Answer == "false" ? "1" : "0";
        falseAnswer.Feedback = request.FalseFeedback;
        falseAnswer.Question = question;
        question.QuestionAnswers.Add(falseAnswer);

        _context.Questions.Add(question);
        _context.SaveChanges();

        var response = _mapper.Map<TrueFalseResponse>(question);
        //response.CreatedBy = _mapper.Map<AccountResponse>(Account);
        //response.UpdatedBy = _mapper.Map<AccountResponse>(Account);
        //response.QuestionAnswers = question.QuestionAnswers;

        return response;
    }

    [HttpPut("truefalse/{id}")]
    public TrueFalseResponse EditTrueFalseQuestion(TrueFalseRequest request, int id)
    {
        var question = _mapper.Map<QuestionTrueFalse>(_context.Questions.Find(id));
        question = _mapper.Map(request, question);

        question.Updated = DateTime.UtcNow;
        question.UpdatedBy = Account;

        var trueAnswer = question.QuestionAnswers.ToList().Find(q => q.Answer == "Tiesa");
        trueAnswer.Fraction = request.Answer == "true" ? "100" : "0";
        trueAnswer.Feedback = request.TrueFeedback;

        var falseAnswer = question.QuestionAnswers.ToList().Find(q => q.Answer == "Netiesa");
        falseAnswer.Fraction = request.Answer == "false" ? "100" : "0";
        falseAnswer.Feedback = request.FalseFeedback;

        _context.SaveChanges();

        var response = _mapper.Map<TrueFalseResponse>(question);

        return response;
    }

    [HttpPost("multichoice")]
    public MultiChoiceResponse CreateMultiChoiceQuestion(MultiChoiceRequest request)
    {
        if (request.Answers.Count < 2)
            throw new AppException("At least 2 answers required.");

        var question = _mapper.Map<QuestionMultiChoice>(request);
        question.QType = "multichoice";
        question.Created = DateTime.UtcNow;
        question.Updated = DateTime.UtcNow;
        question.CreatedBy = Account;
        question.UpdatedBy = Account;

        foreach (var answer in question.QuestionAnswers)
            answer.Question = question;

        _context.Questions.Add(question);
        _context.SaveChanges();

        var response = _mapper.Map<MultiChoiceResponse>(question);

        return response;
    }

    [HttpPut("multichoice/{id}")]
    public MultiChoiceResponse CreateMultiChoiceQuestion(MultiChoiceRequest request, int id)
    {
        if (request.Answers.Count < 2)
            throw new AppException("At least 2 answers required.");

        var question = _mapper.Map<QuestionMultiChoice>(_context.Questions.Find(id));
        question = _mapper.Map(request, question);

        question.Updated = DateTime.UtcNow;
        question.UpdatedBy = Account;

        foreach (var answer in question.QuestionAnswers)
            answer.Question = question;

        _context.SaveChanges();

        var response = _mapper.Map<MultiChoiceResponse>(question);

        return response;
    }

    [HttpGet("{id}/xml")]
    public IActionResult ExportQuestionToXML(int id)
    {
        var question = _context.Questions.Find(id);

        var declaration = new XDeclaration("1.0", "UTF-8", null);
        var doc = new XDocument(declaration);

        doc.Add(
            new XElement("quiz",
                new XComment($"question: {id}"),
                new XElement("question",
                    new XAttribute("type", question.QType),
                    new XElement("name",
                        new XElement("text", question.Name)
                    ),
                    HtmlElement("questiontext", question.QuestionText),
                    HtmlElement("generalfeedback", question.GeneralFeedback),
                    new XElement("defaultgrade", question.DefaultGrade),
                    GenerateElementsByType(question, question.QType)
                )
            )
        );

        var stream = new MemoryStream();
        doc.Save(stream);
        stream.Position = 0;

        var fileName = $"klausimas-{id}-{DateTime.Now.ToString("yymmssfff")}.xml";

        return File(stream, "application/xml", fileName);
    }

    [NonAction]
    public List<XElement> GenerateElementsByType(Question question, string qType)
    {
        var elements = new List<XElement>();
        switch (qType)
        {
            case "truefalse":
            {
                var q = (QuestionTrueFalse)question;
                var trueAnswer = q.QuestionAnswers.Find(x => x.Answer == "Tiesa");
                var falseAnswer = q.QuestionAnswers.Find(x => x.Answer == "Netiesa");
                elements.Add(AnswerElement(trueAnswer, "true"));
                elements.Add(AnswerElement(falseAnswer, "false"));
            }
            break;
            case "multichoice":
            {
                var q = (QuestionMultiChoice)question;
                elements.Add(new XElement("single", q.Single));
                elements.Add(new XElement("shuffleanswers", q.ShuffleAnswers));
                elements.Add(new XElement("answernumbering", q.AnswerNumbering));
                elements.Add(HtmlElement("correctfeedback", q.CorrectFeedback));
                elements.Add(HtmlElement("partiallycorrectfeedback", q.PartiallyCorrectFeedback));
                elements.Add(HtmlElement("incorrectfeedback", q.IncorrectFeedback));
                foreach (var answer in q.QuestionAnswers)
                    elements.Add(AnswerElement(answer));
            }
            break;
            default:
                throw new AppException("Invalid question type.");
        }
        return elements;
    }

    [NonAction]
    public XElement AnswerElement(QuestionAnswer answer, string answerText)
    {
        return new XElement("answer",
                    new XAttribute("fraction", answer.Fraction),
                    new XAttribute("format", "html"),
                    new XElement("text", answerText),
                    HtmlElement("feedback", answer.Feedback)
                );
    }

    [NonAction]
    public XElement AnswerElement(QuestionAnswer answer)
    {
        var (answerText, answerFiles) = FormatHtml(answer.Answer);
        return new XElement("answer",
                    new XAttribute("fraction", answer.Fraction),
                    new XAttribute("format", "html"),
                    new XElement("text", answerText),
                    answerFiles,
                    HtmlElement("feedback", answer.Feedback)
                );
    }

    [NonAction]
    public (XCData, List<XElement>) FormatHtml(string html)
    {
        var files = new List<XElement>();

        var htmlDoc = new HtmlDocument();
        htmlDoc.LoadHtml(html);

        var imgNodes = htmlDoc.DocumentNode.SelectNodes("//img");
        if (imgNodes != null)
        {
            foreach(var imgNode in imgNodes)
            {
                var fileName = imgNode.Attributes["src"].Value.Split("/").Last();
                imgNode.SetAttributeValue("src", $"@@PLUGINFILE@@/{fileName}");
                if (imgNode.Attributes["alt"] == null)
                    imgNode.SetAttributeValue("alt", "");
                imgNode.SetAttributeValue("role", "presentation");
                imgNode.SetAttributeValue("class", "img-fluid");
                if (imgNode.Attributes["style"] != null)
                {
                    var style = imgNode.Attributes["style"].Value.Split(":")[1];
                    var width = style.Remove(style.Length - 1);
                    imgNode.Attributes.Remove("style");
                    imgNode.SetAttributeValue("width", width);
                }
                byte[] imgBytes = System.IO.File.ReadAllBytes($"{_hostEnvironment.WebRootPath}/images/{fileName}");
                files.Add(new XElement("file",
                    new XAttribute("name", fileName),
                    new XAttribute("path", "/"),
                    new XAttribute("encoding", "base64"),
                    Convert.ToBase64String(imgBytes)
                    )
                );
            }
        }

        return (new XCData(htmlDoc.DocumentNode.WriteContentTo()), files);
    }

    [NonAction]
    public XElement HtmlElement(string name, string html)
    {
        var (newHtml, files) = FormatHtml(html);
        return new XElement(name,
                   new XAttribute("format", "html"),
                   new XElement("text", newHtml),
                   files
               );
    }

    
}
