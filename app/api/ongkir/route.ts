import { getDestination, checkOngkir } from "@/app/actions/wilayah";

export async function POST(req: Request) {
  const { kodepos, weight } = await req.json();

  const destination = await getDestination(kodepos);
  const ongkir = await checkOngkir(destination?.[0]?.id || "1", weight);

  return Response.json({ ongkir });
}
