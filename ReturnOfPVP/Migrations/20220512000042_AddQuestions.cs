using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReturnOfPVP.Migrations
{
    public partial class AddQuestions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuestionText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GeneralFeedback = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DefaultGrade = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    QType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Updated = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "QuestionAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fraction = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Feedback = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionAnswers_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionsMultiChoice",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    Single = table.Column<bool>(type: "bit", nullable: false),
                    ShuffleAnswers = table.Column<bool>(type: "bit", nullable: false),
                    CorrectFeedback = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PartiallyCorrectFeedback = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IncorrectFeedback = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AnswerNumbering = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionsMultiChoice", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionsMultiChoice_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionsTrueFalse",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    TrueAnswerId = table.Column<int>(type: "int", nullable: true),
                    FalseAnswerId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionsTrueFalse", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionsTrueFalse_QuestionAnswers_FalseAnswerId",
                        column: x => x.FalseAnswerId,
                        principalTable: "QuestionAnswers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_QuestionsTrueFalse_QuestionAnswers_TrueAnswerId",
                        column: x => x.TrueAnswerId,
                        principalTable: "QuestionAnswers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_QuestionsTrueFalse_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "Created", "PasswordHash", "Verified" },
                values: new object[] { new DateTime(2022, 5, 12, 0, 0, 42, 51, DateTimeKind.Utc).AddTicks(788), "$2a$11$rkwqGG7Dq/bZpiT55h/EzORpcxLQfe7GyrDChg2DkW2K3PcwOeTgG", new DateTime(2022, 5, 12, 0, 0, 42, 51, DateTimeKind.Utc).AddTicks(793) });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionAnswers_QuestionId",
                table: "QuestionAnswers",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionsMultiChoice_QuestionId",
                table: "QuestionsMultiChoice",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionsTrueFalse_FalseAnswerId",
                table: "QuestionsTrueFalse",
                column: "FalseAnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionsTrueFalse_QuestionId",
                table: "QuestionsTrueFalse",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionsTrueFalse_TrueAnswerId",
                table: "QuestionsTrueFalse",
                column: "TrueAnswerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuestionsMultiChoice");

            migrationBuilder.DropTable(
                name: "QuestionsTrueFalse");

            migrationBuilder.DropTable(
                name: "QuestionAnswers");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "Created", "PasswordHash", "Verified" },
                values: new object[] { new DateTime(2022, 4, 12, 15, 45, 45, 859, DateTimeKind.Utc).AddTicks(3392), "$2a$11$xuMp7fxQdngr9s/dStkIz.cW0bCAh7YvW4JDD4danlkYWiJSr7086", new DateTime(2022, 4, 12, 15, 45, 45, 859, DateTimeKind.Utc).AddTicks(3401) });
        }
    }
}
