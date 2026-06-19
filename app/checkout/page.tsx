export const dynamic = "force-dynamic";
import FormCheckout from "./form-checkout";
import Layout from "../component/layout";
import { getCurrentCustomer } from "../actions/customer";
import { redirect } from "next/navigation";

export default async function Checkout() {
  const customer = await getCurrentCustomer();
  
  if (!customer) {
    redirect("/login?callbackUrl=/checkout");
  }

  return (
    <Layout>
      <FormCheckout
      />
    </Layout>
  );
}
