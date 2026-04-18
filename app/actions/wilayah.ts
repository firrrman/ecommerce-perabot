"use server";

export async function getDestination(search: string) {
  const res = await fetch(
    `https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${search}&limit=5&offset=0`,
    {
      headers: {
        key: process.env.KOMERCE_API_KEY!,
      },
    },
  );

  const data = await res.json();
  return data.data;
}

export async function checkOngkir(destination: string, weight: number) {
  const body = new URLSearchParams({
    origin: "8248", // kode lokasi toko (ciaruteun udik)
    destination: destination,
    weight: weight.toString(),
    courier: "jnt",
  });

  const res = await fetch(
    "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost",
    {
      method: "POST",
      headers: {
        key: process.env.KOMERCE_API_KEY!,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    },
  );

  const data = await res.json();
  return data.data;
}
