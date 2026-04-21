export const dynamic = "force-dynamic";
import FormCheckout from "./form-checkout";
import Layout from "../component/layout";

type Props = {
  searchParams: Promise<{
    province?: string;
    city?: string;
    subdistrict?: string;
    kodepos?: string;
    totalWeight?: string;
  }>;
};

export default async function Checkout({ searchParams }: Props) {
  return (
    <Layout>
      <FormCheckout
      />
    </Layout>
  );
}
