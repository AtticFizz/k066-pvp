namespace ReturnOfPVP.Helpers;

using Microsoft.EntityFrameworkCore;
using ReturnOfPVP.Entities;
using ReturnOfPVP.Entities.QuestionTypes;
using BCrypt.Net;
using ReturnOfPVP.Services;

public class DataContext : DbContext
{
    public DbSet<Account> Accounts { get; set; }
    public DbSet<PageContent> PageContents { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<QuestionTrueFalse> QuestionsTrueFalse { get; set; }
    public DbSet<QuestionMultiChoice> QuestionsMultiChoice { get; set; }
    public DbSet<QuestionAnswer> QuestionAnswers { get; set; }
    public DbSet<Quiz> Quizzes { get; set; }

    private readonly IConfiguration Configuration;

    public DataContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // connect to sql database
        options.UseSqlServer(Configuration.GetConnectionString("DevConnection"));
        options.UseLazyLoadingProxies();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>().HasData(new Account
        {
            Id = -1,
            Email = "admin@returnofpvp.com",
            PasswordHash = BCrypt.HashPassword("password"),
            Role = Role.Admin,
            Created = DateTime.UtcNow,
            Verified = DateTime.UtcNow
        });

        int id = 1;
        foreach(int page in Enum.GetValues(typeof(Page)))
        {
            modelBuilder.Entity<PageContent>().HasData(new PageContent
            {
                Id=id++,
                PageName = (Page)page,
                Content = "",
            });

        }



    }
}