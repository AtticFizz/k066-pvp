using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReturnOfPVP.Migrations
{
    public partial class AddQuizTextField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "Quizzes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "Created", "PasswordHash", "Verified" },
                values: new object[] { new DateTime(2022, 5, 23, 20, 30, 17, 63, DateTimeKind.Utc).AddTicks(1872), "$2a$11$6A52vkmO.i3QViO97bEII.6S7Bl9ysEJUsbZpjo7dJJr5U66nfIgu", new DateTime(2022, 5, 23, 20, 30, 17, 63, DateTimeKind.Utc).AddTicks(1877) });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Text",
                table: "Quizzes");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "Created", "PasswordHash", "Verified" },
                values: new object[] { new DateTime(2022, 5, 23, 19, 35, 24, 246, DateTimeKind.Utc).AddTicks(1894), "$2a$11$G.GnHFdns1RgI5gcKO4NaOF9qKRwas/pSBTayL1w54f4duH/xfc8K", new DateTime(2022, 5, 23, 19, 35, 24, 246, DateTimeKind.Utc).AddTicks(1903) });
        }
    }
}
