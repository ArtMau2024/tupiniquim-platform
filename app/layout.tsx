import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Meu Blog",
  description: "Blog criado com Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            backgroundColor: "#111",
            color: "#fff",
            padding: "16px",
          }}
        >
          <nav
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>
              Meu Blog
            </Link>

            <Link href="/blog" style={{ color: "#fff" }}>
              Blog
            </Link>
          </nav>
        </header>

        {/* CONTEÚDO */}
        <main
          style={{
            maxWidth: "800px",
            margin: "20px auto",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {children}
        </main>

        {/* FOOTER */}
        <footer
          style={{
            textAlign: "center",
            padding: "16px",
            fontSize: "14px",
            color: "#555",
          }}
        >
          © {new Date().getFullYear()} Meu Blog
        </footer>
      </body>
    </html>
  );
}