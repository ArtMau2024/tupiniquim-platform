import Link from "next/link";

export const metadata = {
  title: "Quem Somos",
  description:
    "Conheça a Tupiniquim, uma plataforma brasileira que combina tecnologia, conteúdo e estratégia para construir soluções digitais.",
};

const principles = [
  {
    title: "Identidade brasileira",
    description:
      "Criamos soluções conectadas à realidade local, com linguagem próxima, autonomia e valorização de ideias brasileiras.",
  },
  {
    title: "Tecnologia com propósito",
    description:
      "Escolhemos tecnologias que resolvem problemas reais, sustentam o crescimento e tornam a experiência digital mais útil.",
  },
  {
    title: "Evolução consistente",
    description:
      "Construímos em etapas verificáveis, aprendendo com cada entrega e preservando uma base sólida para o próximo avanço.",
  },
];

const processSteps = [
  {
    title: "Entender",
    description: "Compreender o contexto, as necessidades e o resultado esperado.",
  },
  {
    title: "Planejar",
    description: "Transformar objetivos em uma sequência clara e verificável de trabalho.",
  },
  {
    title: "Construir",
    description: "Executar cada etapa com foco em qualidade, simplicidade e utilidade.",
  },
  {
    title: "Evoluir",
    description: "Validar o que foi entregue e avançar sem perder a coerência do projeto.",
  },
];

const roadmap = [
  "Site institucional",
  "Blog",
  "Plataforma Editorial",
  "Área do Usuário",
  "Produtos Digitais",
  "Loja Virtual",
  "Criador de Sites",
  "SaaS Tupiniquim",
];

export default function QuemSomosPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <header className="about-hero-content">
          <p className="about-eyebrow">Quem Somos</p>
          <h1>Tecnologia brasileira para transformar ideias em soluções digitais</h1>
          <p className="about-hero-description">
            A Tupiniquim reúne tecnologia, conteúdo e estratégia para construir
            soluções digitais com identidade brasileira e evolução sustentável.
          </p>
        </header>
      </section>

      <section className="about-introduction">
        <div className="about-section-heading">
          <p className="about-section-kicker">Nossa essência</p>
          <h2>Aprender, experimentar e construir na prática</h2>
        </div>

        <div className="about-introduction-content">
          <p>
            A Tupiniquim nasce da combinação entre aprendizado, experimentação
            e construção prática. Cada etapa transforma conhecimento em uma
            solução útil, verificável e preparada para continuar evoluindo.
          </p>
          <p>
            O projeto não se limita a um site institucional. A visão é evoluir
            do Blog para uma plataforma completa, com publicação de conteúdo,
            área do usuário, produtos digitais, loja virtual e criação de sites.
          </p>
        </div>
      </section>

      <section className="about-principles">
        <div className="about-section-heading">
          <p className="about-section-kicker">Nossos princípios</p>
          <h2>Uma base clara para cada decisão</h2>
        </div>

        <div className="about-principles-grid">
          {principles.map((principle, index) => (
            <article className="about-principle-card" key={principle.title}>
              <span className="about-principle-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-process">
        <div className="about-section-heading about-section-heading-light">
          <p className="about-section-kicker">Como construímos</p>
          <h2>Do entendimento à evolução</h2>
        </div>

        <ol className="about-process-list">
          {processSteps.map((step) => (
            <li className="about-process-item" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-roadmap">
        <div className="about-section-heading">
          <p className="about-section-kicker">Visão de futuro</p>
          <h2>Uma plataforma que cresce por etapas</h2>
        </div>

        <div className="about-roadmap-list" aria-label="Evolução da plataforma">
          {roadmap.map((item, index) => (
            <div className="about-roadmap-step" key={item}>
              <span>{item}</span>
              {index < roadmap.length - 1 && (
                <span className="about-roadmap-arrow" aria-hidden="true">
                  ↓
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <div>
          <p className="about-section-kicker">Conteúdo e aprendizado</p>
          <h2>Acompanhe a construção da Tupiniquim</h2>
          <p>
            Explore artigos sobre tecnologia, negócios, inovação e experiências
            que fazem parte da evolução da plataforma.
          </p>
        </div>

        <Link className="about-cta-link" href="/blog">
          Conheça o Blog Tupiniquim
        </Link>
      </section>

      <style>{`
        .about-page {
          width: 100%;
          color: #111;
          font-family: Arial, Helvetica, sans-serif;
        }

        .about-hero {
          overflow: hidden;
          padding: clamp(56px, 9vw, 112px) clamp(24px, 6vw, 72px);
          background:
            radial-gradient(circle at 88% 16%, rgba(255, 179, 0, 0.2), transparent 28%),
            linear-gradient(120deg, #111 0%, #1b5e20 100%);
          color: #ffffff;
        }

        .about-hero-content {
          max-width: 960px;
        }

        .about-eyebrow,
        .about-section-kicker {
          margin: 0 0 12px;
          color: #ffb300;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .about-hero h1 {
          max-width: 900px;
          margin: 0;
          font-size: clamp(2.4rem, 6vw, 5.4rem);
          line-height: 0.98;
          letter-spacing: -0.045em;
        }

        .about-hero-description {
          max-width: 760px;
          margin: 28px 0 0;
          color: #e7e7e7;
          font-size: clamp(1rem, 2vw, 1.25rem);
          line-height: 1.7;
        }

        .about-introduction,
        .about-principles,
        .about-roadmap {
          padding: clamp(48px, 7vw, 88px) clamp(20px, 5vw, 64px);
        }

        .about-introduction,
        .about-roadmap {
          background: #ffffff;
        }

        .about-principles {
          background: #f5f5f5;
        }

        .about-section-heading {
          max-width: 760px;
          margin-bottom: 32px;
        }

        .about-section-heading h2,
        .about-cta h2 {
          margin: 0;
          font-size: clamp(1.9rem, 4vw, 3.4rem);
          line-height: 1.05;
          letter-spacing: -0.035em;
        }

        .about-introduction-content {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px;
          padding-top: 28px;
          border-top: 3px solid #111;
        }

        .about-introduction-content p,
        .about-principle-card p,
        .about-process-item p,
        .about-cta p {
          margin: 0;
          line-height: 1.7;
        }

        .about-principles-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .about-principle-card {
          min-width: 0;
          padding: 28px;
          border-top: 5px solid #2e7d32;
          background: #ffffff;
        }

        .about-principle-number {
          color: #2e7d32;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .about-principle-card h3,
        .about-process-item h3 {
          margin: 20px 0 10px;
          font-size: 1.35rem;
        }

        .about-principle-card p {
          color: #444;
        }

        .about-process {
          padding: clamp(48px, 7vw, 88px) clamp(20px, 5vw, 64px);
          background: #111;
          color: #ffffff;
        }

        .about-section-heading-light h2 {
          color: #ffffff;
        }

        .about-process-list {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0;
          margin: 40px 0 0;
          padding: 0;
          counter-reset: about-process;
          list-style: none;
        }

        .about-process-item {
          position: relative;
          min-width: 0;
          padding: 26px;
          border-top: 1px solid rgba(255, 255, 255, 0.24);
          counter-increment: about-process;
        }

        .about-process-item + .about-process-item {
          border-left: 1px solid rgba(255, 255, 255, 0.24);
        }

        .about-process-item::before {
          content: "0" counter(about-process);
          color: #ffb300;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .about-process-item p {
          color: #e7e7e7;
        }

        .about-roadmap-list {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .about-roadmap-step {
          display: flex;
          min-height: 112px;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 20px;
          border: 1px solid #d7d7d7;
          background: #f5f5f5;
          font-weight: 800;
        }

        .about-roadmap-arrow {
          flex: 0 0 auto;
          color: #2e7d32;
          font-size: 1.4rem;
        }

        .about-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 36px;
          padding: clamp(40px, 6vw, 72px) clamp(20px, 5vw, 64px);
          background: #1b5e20;
          color: #ffffff;
        }

        .about-cta > div {
          max-width: 760px;
        }

        .about-cta p:not(.about-section-kicker) {
          margin-top: 16px;
          color: #e7e7e7;
        }

        .about-cta-link {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 12px 20px;
          border: 2px solid #ffb300;
          border-radius: 6px;
          background: #ffb300;
          color: #111;
          font-weight: 800;
          text-align: center;
          text-decoration: none;
          transition: background-color 0.2s ease, border-color 0.2s ease,
            color 0.2s ease;
        }

        .about-cta-link:hover {
          border-color: #ffffff;
          background: #ffffff;
          color: #1b5e20;
        }

        .about-cta-link:focus-visible {
          outline: 3px solid #ffb300;
          outline-offset: 4px;
        }

        @media (max-width: 900px) {
          .about-principles-grid,
          .about-roadmap-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .about-process-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .about-process-item:nth-child(3) {
            border-left: 0;
          }

          .about-cta {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .about-hero,
          .about-introduction,
          .about-principles,
          .about-process,
          .about-roadmap,
          .about-cta {
            padding-right: 20px;
            padding-left: 20px;
          }

          .about-introduction-content,
          .about-principles-grid,
          .about-process-list,
          .about-roadmap-list {
            grid-template-columns: 1fr;
          }

          .about-process-item + .about-process-item {
            border-left: 0;
          }

          .about-roadmap-step {
            min-height: auto;
          }

          .about-roadmap-arrow {
            transform: rotate(0deg);
          }

          .about-cta-link {
            width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>
    </div>
  );
}
