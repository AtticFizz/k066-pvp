// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ReturnOfPVP.Helpers;

#nullable disable

namespace ReturnOfPVP.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20220515140155_ChangeFractionToString")]
    partial class ChangeFractionToString
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("ReturnOfPVP.Entities.Account", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("PasswordReset")
                        .HasColumnType("datetime2");

                    b.Property<string>("ResetToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ResetTokenExpires")
                        .HasColumnType("datetime2");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.Property<DateTime?>("Updated")
                        .HasColumnType("datetime2");

                    b.Property<string>("VerificationToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("Verified")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("Accounts");

                    b.HasData(
                        new
                        {
                            Id = -1,
                            Created = new DateTime(2022, 5, 15, 14, 1, 54, 808, DateTimeKind.Utc).AddTicks(435),
                            Email = "admin@returnofpvp.com",
                            PasswordHash = "$2a$11$tyNBnerNpPPIKR2oR/DZMutYvqjJBkIsm0bUBhHOXHwpCrYyEkbzS",
                            Role = 0,
                            Verified = new DateTime(2022, 5, 15, 14, 1, 54, 808, DateTimeKind.Utc).AddTicks(445)
                        });
                });

            modelBuilder.Entity("ReturnOfPVP.Entities.PageContent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PageName")
                        .HasColumnType("int");

                    b.Property<DateTime>("Updated")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("PageContents");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Content = "",
                            PageName = 0,
                            Updated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2,
                            Content = "",
                            PageName = 1,
                            Updated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 3,
                            Content = "",
                            PageName = 2,
                            Updated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 4,
                            Content = "",
                            PageName = 3,
                            Updated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 5,
                            Content = "",
                            PageName = 4,
                            Updated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 6,
                            Content = "",
                            PageName = 5,
                            Updated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 7,
                            Content = "",
                            PageName = 6,
                            Updated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 8,
                            Content = "",
                            PageName = 7,
                            Updated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 9,
                            Content = "",
                            PageName = 8,
                            Updated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        });
                });

            modelBuilder.Entity("ReturnOfPVP.Entities.Question", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime2");

                    b.Property<int?>("CreatedById")
                        .HasColumnType("int");

                    b.Property<decimal>("DefaultGrade")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("GeneralFeedback")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("QType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("QuestionText")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("Updated")
                        .HasColumnType("datetime2");

                    b.Property<int?>("UpdatedById")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CreatedById");

                    b.HasIndex("UpdatedById");

                    b.ToTable("Questions");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Question");
                });

            modelBuilder.Entity("ReturnOfPVP.Entities.QuestionAnswer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Answer")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Feedback")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Fraction")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("QuestionId")
                        .HasColumnType("int");

                    b.Property<int?>("QuestionMultiChoiceId")
                        .HasColumnType("int");

                    b.Property<int?>("QuestionTrueFalseId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("QuestionId");

                    b.HasIndex("QuestionMultiChoiceId");

                    b.HasIndex("QuestionTrueFalseId");

                    b.ToTable("QuestionAnswers");
                });

            modelBuilder.Entity("ReturnOfPVP.Entities.QuestionTypes.QuestionMultiChoice", b =>
                {
                    b.HasBaseType("ReturnOfPVP.Entities.Question");

                    b.Property<string>("AnswerNumbering")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CorrectFeedback")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("IncorrectFeedback")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PartiallyCorrectFeedback")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("ShuffleAnswers")
                        .HasColumnType("bit");

                    b.Property<bool>("Single")
                        .HasColumnType("bit");

                    b.HasDiscriminator().HasValue("QuestionMultiChoice");
                });

            modelBuilder.Entity("ReturnOfPVP.Entities.QuestionTypes.QuestionTrueFalse", b =>
                {
                    b.HasBaseType("ReturnOfPVP.Entities.Question");

                    b.HasDiscriminator().HasValue("QuestionTrueFalse");
                });

            modelBuilder.Entity("ReturnOfPVP.Entities.Account", b =>
                {
                    b.OwnsMany("ReturnOfPVP.Entities.RefreshToken", "RefreshTokens", b1 =>
                        {
                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("int");

                            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b1.Property<int>("Id"), 1L, 1);

                            b1.Property<int>("AccountId")
                                .HasColumnType("int");

                            b1.Property<DateTime>("Created")
                                .HasColumnType("datetime2");

                            b1.Property<string>("CreatedByIp")
                                .HasColumnType("nvarchar(max)");

                            b1.Property<DateTime>("Expires")
                                .HasColumnType("datetime2");

                            b1.Property<string>("ReasonRevoked")
                                .HasColumnType("nvarchar(max)");

                            b1.Property<string>("ReplacedByToken")
                                .HasColumnType("nvarchar(max)");

                            b1.Property<DateTime?>("Revoked")
                                .HasColumnType("datetime2");

                            b1.Property<string>("RevokedByIp")
                                .HasColumnType("nvarchar(max)");

                            b1.Property<string>("Token")
                                .HasColumnType("nvarchar(max)");

                            b1.HasKey("Id");

                            b1.HasIndex("AccountId");

                            b1.ToTable("RefreshToken");

                            b1.WithOwner("Account")
                                .HasForeignKey("AccountId");

                            b1.Navigation("Account");
                        });

                    b.Navigation("RefreshTokens");
                });

            modelBuilder.Entity("ReturnOfPVP.Entities.Question", b =>
                {
                    b.HasOne("ReturnOfPVP.Entities.Account", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById");

                    b.HasOne("ReturnOfPVP.Entities.Account", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");

                    b.Navigation("CreatedBy");

                    b.Navigation("UpdatedBy");
                });

            modelBuilder.Entity("ReturnOfPVP.Entities.QuestionAnswer", b =>
                {
                    b.HasOne("ReturnOfPVP.Entities.Question", "Question")
                        .WithMany()
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ReturnOfPVP.Entities.QuestionTypes.QuestionMultiChoice", null)
                        .WithMany("QuestionAnswers")
                        .HasForeignKey("QuestionMultiChoiceId");

                    b.HasOne("ReturnOfPVP.Entities.QuestionTypes.QuestionTrueFalse", null)
                        .WithMany("QuestionAnswers")
                        .HasForeignKey("QuestionTrueFalseId");

                    b.Navigation("Question");
                });

            modelBuilder.Entity("ReturnOfPVP.Entities.QuestionTypes.QuestionMultiChoice", b =>
                {
                    b.Navigation("QuestionAnswers");
                });

            modelBuilder.Entity("ReturnOfPVP.Entities.QuestionTypes.QuestionTrueFalse", b =>
                {
                    b.Navigation("QuestionAnswers");
                });
#pragma warning restore 612, 618
        }
    }
}
