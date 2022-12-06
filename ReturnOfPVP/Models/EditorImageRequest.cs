namespace ReturnOfPVP.Models;

using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

public class EditorImageRequest
{
    public IFormFile? Upload { get; set; }
}
