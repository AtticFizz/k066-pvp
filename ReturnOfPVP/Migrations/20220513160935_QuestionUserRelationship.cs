using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReturnOfPVP.Migrations
{
    public partial class QuestionUserRelationship : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "Questions",
                newName: "UpdatedById");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Questions",
                newName: "CreatedById");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "Created", "PasswordHash", "Verified" },
                values: new object[] { new DateTime(2022, 5, 13, 16, 9, 35, 550, DateTimeKind.Utc).AddTicks(6280), "$2a$11$bEp9Y3BoxzdOcyhHd/KN/uMzmn8fZnGNCA2XuaUbsCnSO6qwWsA7u", new DateTime(2022, 5, 13, 16, 9, 35, 550, DateTimeKind.Utc).AddTicks(6285) });

            migrationBuilder.CreateIndex(
                name: "IX_Questions_CreatedById",
                table: "Questions",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_UpdatedById",
                table: "Questions",
                column: "UpdatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Accounts_CreatedById",
                table: "Questions",
                column: "CreatedById",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Accounts_UpdatedById",
                table: "Questions",
                column: "UpdatedById",
                principalTable: "Accounts",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Accounts_CreatedById",
                table: "Questions");

            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Accounts_UpdatedById",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_Questions_CreatedById",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_Questions_UpdatedById",
                table: "Questions");

            migrationBuilder.RenameColumn(
                name: "UpdatedById",
                table: "Questions",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "Questions",
                newName: "CreatedBy");

            migrationBuilder.UpdateData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "Created", "PasswordHash", "Verified" },
                values: new object[] { new DateTime(2022, 5, 12, 0, 0, 42, 51, DateTimeKind.Utc).AddTicks(788), "$2a$11$rkwqGG7Dq/bZpiT55h/EzORpcxLQfe7GyrDChg2DkW2K3PcwOeTgG", new DateTime(2022, 5, 12, 0, 0, 42, 51, DateTimeKind.Utc).AddTicks(793) });
        }
    }
}
