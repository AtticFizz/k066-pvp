using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReturnOfPVP.Migrations
{
    public partial class RemoveAcceptTerms : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcceptTerms",
                table: "Accounts");

            migrationBuilder.InsertData(
                table: "Accounts",
                columns: new[] { "Id", "Created", "Email", "FirstName", "LastName", "PasswordHash", "PasswordReset", "ResetToken", "ResetTokenExpires", "Role", "Updated", "VerificationToken", "Verified" },
                values: new object[] { -1, new DateTime(2022, 4, 12, 15, 33, 6, 953, DateTimeKind.Utc).AddTicks(2074), "admin@returnofpvp.com", null, null, "$2a$11$eSs/c.1MYgxmdmUq2ocFRuu1dmn9O7JRe1eTGhTMsJG7kFsKZUdZy", null, null, null, 0, null, null, new DateTime(2022, 4, 12, 15, 33, 6, 953, DateTimeKind.Utc).AddTicks(2077) });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1);

            migrationBuilder.AddColumn<bool>(
                name: "AcceptTerms",
                table: "Accounts",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
