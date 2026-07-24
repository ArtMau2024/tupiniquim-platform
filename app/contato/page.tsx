import Link from "next/link";

export const metadata = {
  title: "Contato",
  description:
    "Entre em contato com a Tupiniquim e acompanhe a evolução de nossas soluções digitais, conteúdos e plataformas.",
};

const futureContactStructure = [
  "Canal institucional de contato",
  "Atendimento organizado",
  "Integração futura com a plataforma",
];

export default function ContatoPage() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <header className="contact-hero-content">
          <p className="contact-eyebrow">Contato</p>
          <h1>Vamos construir o próximo passo</h1>
          <p className="contact-hero-description">
            A Tupiniquim está construindo novos canais para aproximar ideias,
            conteúdo, tecnologia e oportunidades digitais.
          </p>
        </header>
      </section>

      <section className="contact-options">
        <div className="contact-section-heading">
          <p className="contact-section-kicker">Fale com a Tupiniquim</p>
          <h2>Um canal direto está sendo preparado</h2>
          <p>
            A estrutura institucional de atendimento da Tupiniquim está em
            evolução. O objetivo é oferecer um canal organizado, transparente
            e integrado aos futuros serviços da plataforma.
          </p>
        </div>

        <div className="contact-options-grid">
          <article className="contact-option-card">
            <span className="contact-option-label">Conteúdo</span>
            <h3>Acompanhe o Blog</h3>
            <p>
              Encontre conteúdos sobre tecnologia, negócios, inovação e a
              construção da plataforma.
            </p>
            <Link className="contact-option-link" href="/blog">
              Acessar o Blog
            </Link>
          </article>

          <article className="contact-option-card">
            <span className="contact-option-label">Institucional</span>
            <h3>Conheça a Tupiniquim</h3>
            <p>
              Entenda a identidade, os princípios e a visão de evolução do
              projeto.
            </p>
            <Link className="contact-option-link" href="/quem-somos">
              Conhecer a Tupiniquim
            </Link>
          </article>
        </div>
      </section>

      <section className="contact-preparation">
        <div className="contact-section-heading contact-section-heading-light">
          <p className="contact-section-kicker">Próximas evoluções</p>
          <h2>O que está sendo preparado</h2>
          <p>
            A experiência de contato será construída com clareza operacional e
            integrada ao crescimento da plataforma.
          </p>
        </div>

        <ul className="contact-preparation-list">
          {futureContactStructure.map((item, index) => (
            <li key={item}>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{item}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="contact-cta">
        <div>
          <p className="contact-section-kicker">Conteúdo em evolução</p>
          <h2>Acompanhe nossa evolução</h2>
          <p>
            Enquanto o canal direto é preparado, explore os conteúdos e as
            experiências que fazem parte da construção da Tupiniquim.
          </p>
        </div>

        <Link className="contact-cta-link" href="/blog">
          Explorar conteúdos
        </Link>
      </section>

      <style>{`
        .contact-page {
          width: 100%;
          color: #111;
          font-family: Arial, Helvetica, sans-serif;
        }

        .contact-hero {
          overflow: hidden;
          padding: clamp(56px, 9vw, 112px) clamp(24px, 6vw, 72px);
          background:
            radial-gradient(circle at 84% 18%, rgba(255, 179, 0, 0.22), transparent 30%),
            linear-gradient(120deg, #111 0%, #1b5e20 100%);
          color: #ffffff;
        }

        .contact-hero-content {
          max-width: 960px;
        }

        .contact-eyebrow,
        .contact-section-kicker,
        .contact-option-label {
          margin: 0 0 12px;
          color: #ffb300;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .contact-hero h1 {
          max-width: 860px;
          margin: 0;
          font-size: clamp(2.5rem, 6vw, 5.4rem);
          line-height: 0.98;
          letter-spacing: -0.045em;
        }

        .contact-hero-description {
          max-width: 720px;
          margin: 28px 0 0;
          color: #e7e7e7;
          font-size: clamp(1rem, 2vw, 1.25rem);
          line-height: 1.7;
        }

        .contact-options,
        .contact-preparation,
        .contact-cta {
          padding: clamp(48px, 7vw, 88px) clamp(20px, 5vw, 64px);
        }

        .contact-options {
          background: #f5f5f5;
        }

        .contact-section-heading {
          max-width: 780px;
          margin-bottom: 36px;
        }

        .contact-section-heading h2,
        .contact-cta h2 {
          margin: 0;
          font-size: clamp(1.9rem, 4vw, 3.4rem);
          line-height: 1.05;
          letter-spacing: -0.035em;
        }

        .contact-section-heading > p:last-child,
        .contact-option-card p,
        .contact-cta p {
          margin: 18px 0 0;
          line-height: 1.7;
        }

        .contact-section-heading > p:last-child,
        .contact-option-card p {
          color: #444;
        }

        .contact-options-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }

        .contact-option-card {
          display: flex;
          min-width: 0;
          min-height: 280px;
          flex-direction: column;
          align-items: flex-start;
          padding: clamp(26px, 4vw, 40px);
          border-top: 5px solid #2e7d32;
          background: #ffffff;
        }

        .contact-option-label {
          color: #2e7d32;
        }

        .contact-option-card h3 {
          margin: 8px 0 0;
          font-size: clamp(1.45rem, 3vw, 2.1rem);
          letter-spacing: -0.025em;
        }

        .contact-option-link,
        .contact-cta-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          border-radius: 6px;
          font-weight: 800;
          text-align: center;
          text-decoration: none;
          transition:
            background-color 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .contact-option-link {
          margin-top: auto;
          padding: 11px 18px;
          border: 2px solid #2e7d32;
          color: #1b5e20;
        }

        .contact-option-link:hover {
          background: #2e7d32;
          color: #ffffff;
        }

        .contact-preparation {
          background: #111;
          color: #ffffff;
        }

        .contact-section-heading-light > p:last-child {
          color: #e7e7e7;
        }

        .contact-preparation-list {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .contact-preparation-list li {
          display: flex;
          min-height: 132px;
          flex-direction: column;
          justify-content: space-between;
          gap: 24px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.04);
        }

        .contact-preparation-list span {
          color: #ffb300;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .contact-preparation-list strong {
          font-size: 1.15rem;
          line-height: 1.35;
        }

        .contact-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 36px;
          background: #1b5e20;
          color: #ffffff;
        }

        .contact-cta > div {
          max-width: 760px;
        }

        .contact-cta p:not(.contact-section-kicker) {
          color: #e7e7e7;
        }

        .contact-cta-link {
          flex: 0 0 auto;
          padding: 12px 20px;
          border: 2px solid #ffb300;
          background: #ffb300;
          color: #111;
        }

        .contact-cta-link:hover {
          border-color: #ffffff;
          background: #ffffff;
          color: #1b5e20;
        }

        .contact-option-link:focus-visible,
        .contact-cta-link:focus-visible {
          outline: 3px solid #ffb300;
          outline-offset: 4px;
        }

        @media (max-width: 820px) {
          .contact-preparation-list {
            grid-template-columns: 1fr;
          }

          .contact-preparation-list li {
            min-height: auto;
          }

          .contact-cta {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .contact-hero,
          .contact-options,
          .contact-preparation,
          .contact-cta {
            padding-right: 20px;
            padding-left: 20px;
          }

          .contact-options-grid {
            grid-template-columns: 1fr;
          }

          .contact-option-card {
            min-height: 250px;
          }

          .contact-option-link,
          .contact-cta-link {
            width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>
    </div>
  );
}
