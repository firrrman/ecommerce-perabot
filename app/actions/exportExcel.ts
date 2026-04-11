"use server";

import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function exportOrderExcel(year: number) {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  /* =============================
     HITUNG STATISTIK
  ============================= */

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status === "FINISHED" || order.status === "PAID") {
      return sum + order.totalPrice;
    }
    return sum;
  }, 0);

  let totalProductsSold = 0;

  orders.forEach((order) => {
    order.items.forEach((item) => {
      totalProductsSold += item.quantity;
    });
  });

  /* =============================
     SHEET 1 : RINGKASAN
  ============================= */

  const summaryTitle = [[`LAPORAN PENJUALAN TAHUN ${year}`], []];

  const summaryHeader = [
    [
      "ID Order",
      "Nama Customer",
      "Email",
      "Telepon",
      "Kota",
      "Status",
      "Total Pembayaran",
      "Tanggal",
    ],
  ];

  const summaryData = orders.map((order) => [
    order.id,
    order.customerName,
    order.gmail,
    order.phone,
    order.city,
    order.status,
    order.totalPrice,
    order.createdAt.toLocaleDateString("id-ID"),
  ]);

  const summarySheet = XLSX.utils.aoa_to_sheet([
    ...summaryTitle,
    ...summaryHeader,
    ...summaryData,
  ]);

  summarySheet["!cols"] = [
    { wch: 35 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
  ];

  summarySheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 7 },
    },
  ];

  /* =============================
     SHEET 2 : DETAIL TRANSAKSI
  ============================= */

  const detailTitle = [[`DETAIL TRANSAKSI PENJUALAN ${year}`], []];

  const detailHeader = [
    [
      "ID Order",
      "Customer",
      "Produk",
      "Jumlah",
      "Harga",
      "Total",
      "Status",
      "Tanggal",
    ],
  ];

  const detailData: any[] = [];

  orders.forEach((order) => {
    order.items.forEach((item) => {
      detailData.push([
        order.id,
        order.customerName,
        item.product.name,
        item.quantity,
        item.price,
        item.quantity * item.price,
        order.status,
        order.createdAt.toLocaleDateString("id-ID"),
      ]);
    });
  });

  const detailSheet = XLSX.utils.aoa_to_sheet([
    ...detailTitle,
    ...detailHeader,
    ...detailData,
  ]);

  detailSheet["!cols"] = [
    { wch: 35 },
    { wch: 20 },
    { wch: 25 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ];

  detailSheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 7 },
    },
  ];

  /* =============================
     SHEET 3 : STATISTIK
  ============================= */

  const statistikData = [
    [`STATISTIK PENJUALAN TAHUN ${year}`],
    [],
    ["Total Pesanan", totalOrders],
    ["Total Produk Terjual", totalProductsSold],
    ["Total Pendapatan", totalRevenue],
  ];

  const statistikSheet = XLSX.utils.aoa_to_sheet(statistikData);

  statistikSheet["!cols"] = [{ wch: 25 }, { wch: 20 }];

  /* =============================
     WORKBOOK
  ============================= */

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");
  XLSX.utils.book_append_sheet(workbook, detailSheet, "Detail Transaksi");
  XLSX.utils.book_append_sheet(workbook, statistikSheet, "Statistik");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });

  return buffer;
}
