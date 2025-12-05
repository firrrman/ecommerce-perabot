import { createUser, deleteUser, updateUser, getUsers } from "./actions/users";
import Header from "./component/header";
import Layout from "./component/layout";

export default async function Home() {
  const users = await getUsers();
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">ECOMMERCE PERABOTAN</h1>
    </Layout>
  );
}
