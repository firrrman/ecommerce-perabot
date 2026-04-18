export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id: id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order tidak ditemukan" });
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([500, 400]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 360;

  page.drawText("LABEL PENGIRIMAN", {
    x: 160,
    y,
    size: 18,
    font: bold,
  });

  y -= 40;

  page.drawText("DATA PENGIRIM", {
    x: 50,
    y,
    size: 14,
    font: bold,
  });

  y -= 20;

  page.drawText(`Nama Pengirim : Firman Hakim`, { x: 50, y, size: 12, font });
  y -= 18;
  page.drawText(`No HP : 085810642529`, { x: 50, y, size: 12, font });
  y -= 18;
  page.drawText(`Email : Perabotan1174@gmail.com`, {
    x: 50,
    y,
    size: 12,
    font,
  });

  y -= 40;

  page.drawText("DATA PENERIMA", {
    x: 50,
    y,
    size: 14,
    font: bold,
  });

  y -= 20;

  page.drawText(`Nama Penerima : ${order.customerName}`, {
    x: 50,
    y,
    size: 12,
    font,
  });
  y -= 18;
  page.drawText(`No HP : ${order.phone}`, { x: 50, y, size: 12, font });
  y -= 18;
  page.drawText(`Email : ${order.gmail}`, { x: 50, y, size: 12, font });
  y -= 18;
  page.drawText(`Alamat : ${order.address}`, { x: 50, y, size: 12, font });
  y -= 18;
  page.drawText(`Kelurahan : ${order.village}`, { x: 50, y, size: 12, font });
  y -= 18;
  page.drawText(`Kecamatan : ${order.subdistrict}`, {
    x: 50,
    y,
    size: 12,
    font,
  });
  y -= 18;
  page.drawText(`Kota : ${order.city}`, { x: 50, y, size: 12, font });
  y -= 18;
  page.drawText(`Provinsi : ${order.province}`, { x: 50, y, size: 12, font });
  y -= 18;
  page.drawText(`Kode Pos : ${order.portalCode}`, { x: 50, y, size: 12, font });

  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="label-${order.id}.pdf"`,
    },
  });
}
