import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return Response.json([]);
  }

  const results = await prisma.regions.findMany({
    where: {
      label: {
        contains: q,
        mode: "insensitive",
      },
    },
    take: 10,
    orderBy: { label: "asc" },
  });

  return Response.json(results);
}
