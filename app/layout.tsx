import "./globals.css";
import Link from "next/link";

export const metadata = {
  metadataBase: new URL("https://tupiniquim.com"),

  title: {
    default: "Tupiniquim",
    template: "%s | Tupiniquim",
  },

  description:
    "Tecnologia, inovação e conteúdo digital para impulsionar negócios com identidade brasileira.",

  openGraph: {
    title: "Tupiniquim",
    description:
      "Tecnologia, inovação e conteúdo digital para impulsionar negócios.",
    url: "https://tupiniquim.com",
    siteName: "Tupiniquim",
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tupiniquim",
    description:
      "Soluções digitais com identidade brasileira.",
  },
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
            padding: "16px 0",
            width: "100%",
          }}
        >
          <nav
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 24px",
            }}
          >
            <Link
              href="/"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Tupiniquim
            </Link>

            <Link
              href="/blog"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Blog
            </Link>
          </nav>
        </header>

        {/* CONTAINER PRINCIPAL */}
        <div
          style={{
            maxWidth: "1400px",
            margin: "20px auto",
            padding: "0 24px",
          }}
        >
          <main
            style={{
              backgroundColor: "#fff",
              padding: "32px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            {children}
          </main>
        </div>

        {/* FOOTER */}
        <footer
          style={{
            textAlign: "center",
            padding: "20px",
            fontSize: "14px",
            color: "#555",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          © {new Date().getFullYear()} Tupiniquim
        </footer>
      </body>
    </html>
  );
}