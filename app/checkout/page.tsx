export const dynamic = "force-dynamic";
import FormCheckout from "../component/form-checkout";
import Layout from "../component/layout";
import { Villages } from "../actions/wilayah";

export default async function Checkout() {
  const village = await Villages();

  return (
    <Layout>
      <FormCheckout villages={village} />
    </Layout>
  );
}
