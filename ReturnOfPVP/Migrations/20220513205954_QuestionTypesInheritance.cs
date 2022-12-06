using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReturnOfPVP.Migrations
{
    public partial class QuestionTypesInheritance : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Accounts_CreatedById",
                table: "Questions");

            migrationBuilder.DropTable(
                name: "QuestionsMultiChoice");

            migrationBuilder.DropTable(
                name: "QuestionsTrueFalse");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedById",
                table: "Questions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "AnswerNumbering",
                table: "Questions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CorrectFeedback",
                table: "Questions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Questions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "IncorrectFeedback",
                table: "Questions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PartiallyCorrectFeedback",
                table: "Questions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShuffleAnswers",
                table: "Questions",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Single",
                table: "Questions",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionMultiChoiceId",
                table: "QuestionAnswers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionTrueFalseId",
                table: "QuestionAnswers",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "Created", "PasswordHash", "Verified" },
                values: new object[] { new DateTime(2022, 5, 13, 20, 59, 53, 934, DateTimeKind.Utc).AddTicks(9398), "$2a$11$.1EwAk26ssSA4uxo1hC/XuCgQqdwncaasvKeJMPlhTgjs4STKkR8C", new DateTime(2022, 5, 13, 20, 59, 53, 934, DateTimeKind.Utc).AddTicks(9403) });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionAnswers_QuestionMultiChoiceId",
                table: "QuestionAnswers",
                column: "QuestionMultiChoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionAnswers_QuestionTrueFalseId",
                table: "QuestionAnswers",
                column: "QuestionTrueFalseId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionAnswers_Questions_QuestionMultiChoiceId",
                table: "QuestionAnswers",
                column: "QuestionMultiChoiceId",
                principalTable: "Questions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionAnswers_Questions_QuestionTrueFalseId",
                table: "QuestionAnswers",
                column: "QuestionTrueFalseId",
                principalTable: "Questions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Accounts_CreatedById",
                table: "Questions",
                column: "CreatedById",
                principalTable: "Accounts",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionAnswers_Questions_QuestionMultiChoiceId",
                table: "QuestionAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionAnswers_Questions_QuestionTrueFalseId",
                table: "QuestionAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Accounts_CreatedById",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_QuestionAnswers_QuestionMultiChoiceId",
                table: "QuestionAnswers");

            migrationBuilder.DropIndex(
                name: "IX_QuestionAnswers_QuestionTrueFalseId",
                table: "QuestionAnswers");

            migrationBuilder.DropColumn(
                name: "AnswerNumbering",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "CorrectFeedback",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "IncorrectFeedback",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "PartiallyCorrectFeedback",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "ShuffleAnswers",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "Single",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "QuestionMultiChoiceId",
                table: "QuestionAnswers");

            migrationBuilder.DropColumn(
                name: "QuestionTrueFalseId",
                table: "QuestionAnswers");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedById",
                table: "Questions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "QuestionsMultiChoice",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    AnswerNumbering = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CorrectFeedback = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IncorrectFeedback = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PartiallyCorrectFeedback = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShuffleAnswers = table.Column<bool>(type: "bit", nullable: false),
                    Single = table.Column<bool>(type: "bit", nullable: false)
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
                    FalseAnswerId = table.Column<int>(type: "int", nullable: true),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    TrueAnswerId = table.Column<int>(type: "int", nullable: true)
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
                values: new object[] { new DateTime(2022, 5, 13, 16, 9, 35, 550, DateTimeKind.Utc).AddTicks(6280), "$2a$11$bEp9Y3BoxzdOcyhHd/KN/uMzmn8fZnGNCA2XuaUbsCnSO6qwWsA7u", new DateTime(2022, 5, 13, 16, 9, 35, 550, DateTimeKind.Utc).AddTicks(6285) });

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

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Accounts_CreatedById",
                table: "Questions",
                column: "CreatedById",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
