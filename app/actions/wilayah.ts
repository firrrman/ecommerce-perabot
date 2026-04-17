"use server";

export async function getProvinces() {
  const res = await fetch("https://wilayah.id/api/provinces.json");
  const data = await res.json();
  return data.data;
}

export async function getCities(provinceCode: string) {
  const res = await fetch(
    `https://wilayah.id/api/regencies/${provinceCode}.json`,
  );
  const data = await res.json();
  return data.data;
}

export async function getDistricts(cityCode: string) {
  const res = await fetch(`https://wilayah.id/api/districts/${cityCode}.json`);
  const data = await res.json();
  return data.data;
}

export async function getVillages(districtCode: string) {
  const res = await fetch(
    `https://wilayah.id/api/villages/${districtCode}.json`,
  );
  const data = await res.json();
  return data.data;
}

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
