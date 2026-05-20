export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";

function wrapText(text: string, maxLength: number): string[] {
  if (!text) return [];
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxLength) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id: id },
    include: {
      items: {
        include: {
          product: true,
          size: true,
          color: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order tidak ditemukan" });
  }

  const pdfDoc = await PDFDocument.create();
  // Standard A6 shipping label page size (400 x 600 pt)
  const page = pdfDoc.addPage([400, 600]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Draw outer border
  page.drawRectangle({
    x: 15,
    y: 15,
    width: 370,
    height: 570,
    borderColor: rgb(0.1, 0.1, 0.1),
    borderWidth: 1.5,
  });

  // 1. Header (y: 540 to 570)
  page.drawText("PERABOTAN", {
    x: 30,
    y: 550,
    size: 16,
    font: bold,
    color: rgb(0.1, 0.3, 0.7),
  });

  page.drawText("LABEL PENGIRIMAN", {
    x: 230,
    y: 553,
    size: 12,
    font: bold,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawLine({
    start: { x: 15, y: 535 },
    end: { x: 385, y: 535 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  // ── PENERIMA ──────────────────────────────────────────────────
  let y = 521; // starts just below header separator at 535

  page.drawText("PENERIMA:", {
    x: 30, y,
    size: 8, font: bold,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 15;

  page.drawText(order.customerName, {
    x: 30, y,
    size: 12, font: bold,
    color: rgb(0, 0, 0),
  });
  y -= 15;

  page.drawText(`No HP: ${order.phone}`, {
    x: 30, y,
    size: 9, font: font,
  });
  y -= 13;

  const addressLines = wrapText(order.address, 55);
  addressLines.forEach((line) => {
    page.drawText(line, { x: 30, y, size: 9, font: font });
    y -= 13;
  });

  const regionText = `${order.village}, ${order.subdistrict}, ${order.city}`;
  page.drawText(regionText, { x: 30, y, size: 9, font: font });
  y -= 13;

  const provinceText = `${order.province}, ${order.portalCode}`;
  page.drawText(provinceText, { x: 30, y, size: 9, font: bold });
  y -= 13;

  let currentY = y;
  page.drawLine({
    start: { x: 15, y: currentY },
    end: { x: 385, y: currentY },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });
  currentY -= 13;

  // ── PENGIRIM ──────────────────────────────────────────────────
  page.drawText("PENGIRIM:", {
    x: 30, y: currentY,
    size: 8, font: bold,
    color: rgb(0.4, 0.4, 0.4),
  });
  currentY -= 14;

  page.drawText("Firman Hakim (Perabotan)", {
    x: 30, y: currentY,
    size: 10, font: bold,
  });
  currentY -= 13;

  page.drawText("No HP: 085810642529", {
    x: 30, y: currentY,
    size: 9, font: font,
  });
  currentY -= 13;

  page.drawText("Bogor, Jawa Barat", {
    x: 30, y: currentY,
    size: 9, font: font,
  });
  currentY -= 11;
  page.drawLine({
    start: { x: 15, y: currentY },
    end: { x: 385, y: currentY },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  // 5. Daftar Barang
  currentY -= 15;
  page.drawText("DAFTAR BARANG:", {
    x: 30,
    y: currentY,
    size: 8,
    font: bold,
    color: rgb(0.4, 0.4, 0.4),
  });

  currentY -= 15;
  order.items.forEach((item) => {
    const productName = item.product.name;
    const specParts = [];
    if (item.size) specParts.push(`Size: ${item.size.name}`);
    if (item.color) specParts.push(`Color: ${item.color.name}`);
    const spec = specParts.length > 0 ? ` (${specParts.join(", ")})` : "";
    const itemText = `• [Qty: ${item.quantity}] ${productName}${spec}`;

    const wrappedItemLines = wrapText(itemText, 55);
    wrappedItemLines.forEach((line) => {
      // Ensure we don't draw outside footer area
      if (currentY > 80) {
        page.drawText(line, { x: 30, y: currentY, size: 9, font: font });
        currentY -= 14;
      }
    });
  });

  // 6. Catatan (if any)
  if (order.note) {
    currentY -= 5;
    if (currentY > 85) {
      page.drawLine({
        start: { x: 15, y: currentY },
        end: { x: 385, y: currentY },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8),
      });
      currentY -= 12;
      page.drawText("CATATAN:", {
        x: 30,
        y: currentY,
        size: 8,
        font: bold,
        color: rgb(0.4, 0.4, 0.4),
      });
      currentY -= 12;
      const noteLines = wrapText(order.note, 60);
      noteLines.forEach((line) => {
        if (currentY > 80) {
          page.drawText(line, {
            x: 30,
            y: currentY,
            size: 8,
            font: font,
            color: rgb(0.3, 0.3, 0.3),
          });
          currentY -= 11;
        }
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="label-${order.id}.pdf"`,
    },
  });
}
