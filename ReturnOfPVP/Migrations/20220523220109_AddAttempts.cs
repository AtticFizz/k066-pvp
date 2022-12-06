using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReturnOfPVP.Migrations
{
    public partial class AddAttempts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Attempts",
                table: "Quizzes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "Created", "PasswordHash", "Verified" },
                values: new object[] { new DateTime(2022, 5, 23, 22, 1, 8, 429, DateTimeKind.Utc).AddTicks(349), "$2a$11$nfoEKucmXWnvhjNvRRFtu.3zY1qhsSJ.q/lpOQzJzjFWn3dEF39PO", new DateTime(2022, 5, 23, 22, 1, 8, 429, DateTimeKind.Utc).AddTicks(359) });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Attempts",
                table: "Quizzes");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "Created", "PasswordHash", "Verified" },
                values: new object[] { new DateTime(2022, 5, 23, 20, 58, 1, 863, DateTimeKind.Utc).AddTicks(8199), "$2a$11$zz.oiwqxZiQJdGSMfVobRumefn7mrlQH4kfCdy78.7NS3LGISyEpq", new DateTime(2022, 5, 23, 20, 58, 1, 863, DateTimeKind.Utc).AddTicks(8208) });
        }
    }
}
