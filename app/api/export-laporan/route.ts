import { NextResponse } from "next/server";
import { exportOrderExcel } from "@/app/actions/exportExcel";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year"));

  const buffer = await exportOrderExcel(year);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=laporan-${year}.xlsx`,
    },
  });
}
