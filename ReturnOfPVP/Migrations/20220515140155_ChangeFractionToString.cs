using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReturnOfPVP.Migrations
{
    public partial class ChangeFractionToString : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Fraction",
                table: "QuestionAnswers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "Created", "PasswordHash", "Verified" },
                values: new object[] { new DateTime(2022, 5, 15, 14, 1, 54, 808, DateTimeKind.Utc).AddTicks(435), "$2a$11$tyNBnerNpPPIKR2oR/DZMutYvqjJBkIsm0bUBhHOXHwpCrYyEkbzS", new DateTime(2022, 5, 15, 14, 1, 54, 808, DateTimeKind.Utc).AddTicks(445) });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Fraction",
                table: "QuestionAnswers",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "Created", "PasswordHash", "Verified" },
                values: new object[] { new DateTime(2022, 5, 13, 20, 59, 53, 934, DateTimeKind.Utc).AddTicks(9398), "$2a$11$.1EwAk26ssSA4uxo1hC/XuCgQqdwncaasvKeJMPlhTgjs4STKkR8C", new DateTime(2022, 5, 13, 20, 59, 53, 934, DateTimeKind.Utc).AddTicks(9403) });
        }
    }
}
