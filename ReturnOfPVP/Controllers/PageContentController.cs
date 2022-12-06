namespace ReturnOfPVP.Controllers;

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ReturnOfPVP.Authorization;
using ReturnOfPVP.Entities;
using ReturnOfPVP.Helpers;
using ReturnOfPVP.Models;
using ReturnOfPVP.Services;

[Authorize(Role.Admin)]
[ApiController]
[Route("/api/[controller]")]
public class PageContentController : BaseController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly IWebHostEnvironment _hostEnvironment;

    public PageContentController(DataContext context, IMapper mapper, IWebHostEnvironment hostEnvironment)
    {
        _context = context;
        _mapper = mapper;
        _hostEnvironment = hostEnvironment;
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormCollection formdata)
    {
        if (formdata == null) return BadRequest(new { message = "Nepavyko įkelti nuotraukos." });
        var image = formdata.Files[0];
        if (image.Length > 5 * 1024 * 1024) return BadRequest(new { message = "Nuotrauka negali būti didesnė nei 5 Mb." });
        if (!new string[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff" }.Contains(Path.GetExtension(image.FileName)))
            return BadRequest(new { message = "Nepalaikomas nuotraukos tipas.\nPalaikomi tipai: jpg, jpeg, png, gif, bmp, webp, tiff." });

        string imageName = new string(Path.GetFileNameWithoutExtension(image.FileName)).Replace(' ', '-');
        imageName += DateTime.Now.ToString("yymmssfff") + Path.GetExtension(image.FileName);
        var imagePath = Path.Combine(_hostEnvironment.WebRootPath, "images", imageName);

        using (var stream = System.IO.File.Create(imagePath))
        {
            await image.CopyToAsync(stream);
        }

        return Ok(new { url = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/images/{imageName}" });
    }

    [AllowAnonymous]
    [HttpGet("{page}")]
    public IActionResult getPageContent(Page page)
    {
        var pageContent = _context.PageContents.Where(x => x.PageName == page).First();
        return Ok(pageContent);
    }

    [HttpPut("{page}")]
    public IActionResult PutPageContent(Page page, [FromBody]EditorContentRequest request)
    {
        PageContent pageContent;
        if (!_context.PageContents.Any(x => x.PageName == page))
            pageContent = new PageContent();
        else
            pageContent = _context.PageContents.Where(x => x.PageName == page).First();

        pageContent.Content = request.Content;
        pageContent.Updated = DateTime.UtcNow;
        _context.PageContents.Update(pageContent);
        _context.SaveChanges();
        return Ok();
    }
}
