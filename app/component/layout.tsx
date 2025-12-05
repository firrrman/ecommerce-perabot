import Header from "./header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="p-10">{children}</main>
    </div>
  );
}
