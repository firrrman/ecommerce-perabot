export const dynamic = "force-dynamic";

import Layout from "../component/layout";
import { getCurrentCustomer, getCustomerOrdersAction } from "../actions/customer";
import { redirect } from "next/navigation";
import RiwayatPesananClient from "./riwayat-client";

export default async function RiwayatPesananPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login?callbackUrl=/riwayat-pesanan");
  }

  const { orders } = await getCustomerOrdersAction();

  return (
    <Layout>
      <RiwayatPesananClient initialOrders={orders || []} customer={customer} />
    </Layout>
  );
}
