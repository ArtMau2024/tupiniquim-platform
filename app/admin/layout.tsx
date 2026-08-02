export const metadata = { title: "Administração" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div data-cms-admin="true" style={{ minHeight: "60vh" }}>{children}</div>;
}
