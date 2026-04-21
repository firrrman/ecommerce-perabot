import { NextResponse } from "next/server";
import { exportFinancialExcel } from "@/app/actions/exportExcel";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  try {
    const buffer = await exportFinancialExcel(year);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=laporan-keuangan-${year}.xlsx`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}
