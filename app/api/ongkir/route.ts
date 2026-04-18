import { getDestination, checkOngkir } from "@/app/actions/wilayah";

export async function POST(req: Request) {
  const { search, idAlamat, weight } = await req.json();

  let destination = null;
  let ongkir = null;

  if (search) {
    destination = await getDestination(search);
  }

  if (idAlamat && weight) {
    ongkir = await checkOngkir(idAlamat, weight);
  }

  return Response.json({ destination, ongkir });
}