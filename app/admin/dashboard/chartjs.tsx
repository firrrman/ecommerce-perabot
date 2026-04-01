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
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function ChartJs({
  order,
  year,
}: {
  order: number[];
  year: number;
}) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/admin/dashboard?year=${e.target.value}`);
  };

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
        label: `Jumlah Order`,
        data: order,
        backgroundColor: "#2645ff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Grafik Order Bulanan ${year}`,
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
      <div className="flex justify-end">
        <select
          value={year || ""}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-xs"
        >
          <option value={currentYear}>{currentYear}</option>
          <option value={currentYear - 1}>{currentYear - 1}</option>
          <option value={currentYear - 2}>{currentYear - 2}</option>
        </select>
      </div>

      <Bar data={data} options={options} />
    </div>
  );
}
