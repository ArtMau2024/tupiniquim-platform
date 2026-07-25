import "./globals.css";
import Header from "@/components/layout/Header";

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
    description: "Soluções digitais com identidade brasileira.",
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
        <Header />

        {/* CONTAINER PRINCIPAL */}
        <div
          style={{
            maxWidth: "1400px",
            margin: "20px auto",
            padding: "0 24px",
          }}
        >
          <main>{children}</main>
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
