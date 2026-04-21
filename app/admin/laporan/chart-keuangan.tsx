"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { title } from "process";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function ChartKeuangan({
  revenue,
  cost,
  profit,
  year,
}: {
  revenue: number[];
  cost: number[];
  profit: number[];
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
        label: "Pendapatan",
        data: revenue,
        backgroundColor: "rgba(19, 110, 255, 0.8)",
      },
      {
        label: "Modal",
        data: cost,
        backgroundColor: "rgba(254, 114, 0, 0.94)",
      },
      {
        label: "Laba",
        data: profit,
        backgroundColor: "rgba(0, 248, 91, 0.8)",
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
        text: `Analisis Keuangan Bulanan - ${year || currentYear}`,
        align: "center" as const,
        font: {
          size: 18,
          weight: "bold" as const,
        },
        padding: {
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 12,
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.y ?? 0;
            return `${label}: Rp ${value.toLocaleString("id-ID")}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
          callback: function (value: any) {
            if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}jt`;
            if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}rb`;
            return `Rp ${value}`;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-8 border border-slate-100">
      <div className="h-[400px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
