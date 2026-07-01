import Link from "next/link";

export const metadata = {
  title: "Tupiniquim",
  description:
    "Tecnologia, inovação e conteúdo digital para impulsionar negócios.",
};

export default function Home() {
  return (
    <main>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Tecnologia e conteúdo para crescer no digital
          </h1>

          <p>
            A Tupiniquim cria soluções digitais com identidade brasileira,
            combinando tecnologia, estratégia e inovação.
          </p>

          <div className="hero-actions">
            <button className="btn primary">
              Conhecer soluções
            </button>

            <Link href="/blog">
              <button className="btn secondary">
                Acessar blog
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="section">
        <h2>Nossas soluções</h2>

        <div className="grid-3">
          <div className="card">
            <h3>Desenvolvimento Web</h3>
            <p>Criação de aplicações modernas e escaláveis.</p>
          </div>

          <div className="card">
            <h3>Conteúdo Estratégico</h3>
            <p>Produção voltada para tráfego e autoridade digital.</p>
          </div>

          <div className="card">
            <h3>Inovação Digital</h3>
            <p>Soluções criativas com foco em resultado e crescimento.</p>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="section light">
        <h2>Por que escolher a Tupiniquim?</h2>

        <div className="grid-3">
          <div>
            <h4>🇧🇷 Identidade brasileira</h4>
            <p>Soluções conectadas com nossa cultura e realidade.</p>
          </div>

          <div>
            <h4>⚙️ Tecnologia moderna</h4>
            <p>Utilizamos ferramentas atuais e escaláveis.</p>
          </div>

          <div>
            <h4>📈 Foco em resultado</h4>
            <p>Crescimento sustentável e geração de valor.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Vamos construir algo juntos?</h2>
        <button className="btn primary">Fale conosco</button>
      </section>

      {/* BLOG */}
      <section className="section">
        <h2>Conteúdo e insights</h2>

        <p>
          Acompanhe nosso blog com conteúdos sobre tecnologia,
          negócios e inovação.
        </p>

        <Link href="/blog">
          <button className="btn secondary">
            Ver artigos
          </button>
        </Link>
      </section>

      {/* ESTILO */}
      <style>{`
        .hero {
          background: linear-gradient(120deg,#111,#1B5E20);
          color: #fff;
          padding: 80px 40px;
          border-radius: 10px;
          text-align: center;
        }

        .hero h1 {
          font-size: 36px;
          margin-bottom: 16px;
        }

        .hero p {
          max-width: 600px;
          margin: 0 auto 20px;
          color: #ddd;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .btn.primary {
          background: #2E7D32;
          color: #fff;
        }

        .btn.primary:hover {
          background: #1B5E20;
        }

        .btn.secondary {
          background: #FFB300;
          color: #000;
        }

        .section {
          margin-top: 50px;
          text-align: center;
        }

        .section.light {
          background: #f3f3f3;
          padding: 30px;
          border-radius: 10px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .grid-3 {
            grid-template-columns: 1fr;
          }
          .hero {
            padding: 40px 20px;
          }
          .hero h1 {
            font-size: 26px;
          }
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }
        }

        .card {
          padding: 20px;
          border: 1px solid #eee;
          border-radius: 10px;
          background: #fff;
        }

        .cta {
          background: #111;
          color: #fff;
          padding: 40px;
          border-radius: 10px;
          margin-top: 40px;
          text-align: center;
        }
      `}</style>

    </main>
  );
}
