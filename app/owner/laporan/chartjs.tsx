"use client";
export const dynamic = "force-dynamic";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function ChartJs({
  pending,
  paid,
  shipped,
  finished,
  cancelled,
  year,
}: {
  pending: number[];
  paid: number[];
  shipped: number[];
  finished: number[];
  cancelled: number[];
  year: number;
}) {
  const currentYear = new Date().getFullYear();

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    datasets: [
      {
        label: `Pesanan Pending`,
        data: pending,
        backgroundColor: "#facc15",
      },
      {
        label: `Pesanan Dibayar`,
        data: paid,
        backgroundColor: "#3b82f6",
      },
      {
        label: `Pesanan Dikirim`,
        data: shipped,
        backgroundColor: "#8b5cf6",
      },
      {
        label: `Pesanan Selesai`,
        data: finished,
        backgroundColor: "#22c55e",
      },
      {
        label: `Pesanan Dibatalkan`,
        data: cancelled,
        backgroundColor: "#ef4444",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Grafik Order Bulanan ${year || currentYear}`,
        font: {
          size: 18,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6">
      <div className="h-[400px]">
        <Bar data={data} options={options} />
      </div>    </div>
  );
}

