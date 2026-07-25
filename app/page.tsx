import Link from "next/link";

export const metadata = {
  title: "Tupiniquim",
  description:
    "Tecnologia, estratégia e identidade brasileira para transformar ideias em soluções digitais que evoluem por etapas.",
};

const solutions = [
  {
    title: "Desenvolvimento Web",
    description:
      "Sites, aplicações e experiências digitais construídas com uma base organizada, responsiva e preparada para evolução.",
  },
  {
    title: "Conteúdo Estratégico",
    description:
      "Conteúdo voltado para presença digital, autoridade, aprendizado e relacionamento com o público.",
  },
  {
    title: "Plataformas Digitais",
    description:
      "Estruturas preparadas para integrar usuários, serviços, produtos e novas oportunidades digitais.",
  },
];

const currentPlatform = [
  "Site institucional",
  "Blog",
  "Páginas institucionais",
  "Navegação global responsiva",
];

const futurePlatform = [
  "Plataforma Editorial",
  "Área do Usuário",
  "Produtos Digitais",
  "Loja Virtual",
  "Criador de Sites",
  "SaaS Tupiniquim",
];

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">Tecnologia com identidade brasileira</p>
          <h1>Tecnologia e conteúdo para construir no digital</h1>
          <p className="home-hero-description">
            A Tupiniquim combina tecnologia, estratégia e identidade brasileira
            para transformar ideias em soluções digitais que evoluem por etapas.
          </p>

          <div className="home-actions">
            <Link className="home-action home-action-primary" href="/#solucoes">
              Conhecer soluções
            </Link>
            <Link className="home-action home-action-secondary" href="/blog">
              Acessar o Blog
            </Link>
          </div>
        </div>
      </section>

      <section className="home-solutions" id="solucoes">
        <div className="home-section-heading">
          <p className="home-section-kicker">Soluções digitais</p>
          <h2>Estruturas preparadas para evoluir com o negócio</h2>
          <p>
            Transformamos ideias em experiências, conteúdo e plataformas com
            uma base clara, responsiva e preparada para novos passos.
          </p>
        </div>

        <div className="home-solutions-grid">
          {solutions.map((solution, index) => (
            <div className="home-solution-card" key={solution.title}>
              <span className="home-card-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{solution.title}</h3>
              <p>{solution.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-differentials">
        <div className="home-section-heading home-section-heading-light">
          <p className="home-section-kicker">Como construímos</p>
          <h2>Clareza em cada decisão e evolução em cada entrega</h2>
          <p>
            Tecnologia aplicada a necessidades reais, com processos verificáveis
            e foco no valor construído ao longo do caminho.
          </p>
        </div>

        <div className="home-differentials-grid">
          <article className="home-differential-card">
            <span className="home-card-number" aria-hidden="true">01</span>
            <h3>Identidade brasileira</h3>
            <p>
              Soluções conectadas à realidade, à linguagem e às oportunidades
              locais.
            </p>
          </article>

          <article className="home-differential-card">
            <span className="home-card-number" aria-hidden="true">02</span>
            <h3>Tecnologia com propósito</h3>
            <p>
              Ferramentas escolhidas para resolver problemas e sustentar o
              crescimento.
            </p>
          </article>

          <article className="home-differential-card">
            <span className="home-card-number" aria-hidden="true">03</span>
            <h3>Evolução verificável</h3>
            <p>
              Cada entrega é testada antes de se tornar a base da próxima etapa.
            </p>
          </article>

          <article className="home-differential-card">
            <span className="home-card-number" aria-hidden="true">04</span>
            <h3>Foco em resultado</h3>
            <p>
              Experiências digitais orientadas por utilidade, clareza e valor.
            </p>
          </article>
        </div>
      </section>

      <section className="home-platform">
        <div className="home-section-heading">
          <p className="home-section-kicker">Uma plataforma em evolução</p>
          <h2>Crescimento por etapas, com uma base que permanece coerente</h2>
          <p>
            A Tupiniquim preserva o que já funciona enquanto prepara novas
            capacidades para ampliar conteúdo, serviços e experiências digitais.
          </p>
        </div>

        <div className="home-platform-grid">
          <div className="home-platform-panel home-platform-current">
            <p className="home-platform-label">Realidade atual</p>
            <h3>Estrutura já construída</h3>
            <ul>
              {currentPlatform.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="home-platform-panel home-platform-future">
            <p className="home-platform-label">Próximas evoluções</p>
            <h3>Visão de futuro</h3>
            <ul>
              {futurePlatform.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="home-content">
        <div className="home-content-copy">
          <p className="home-section-kicker">Conteúdo e aprendizado</p>
          <h2>Conteúdo para aprender e evoluir</h2>
          <p>
            Acompanhe publicações sobre tecnologia, negócios, inovação e
            experiências práticas na construção de soluções digitais.
          </p>
        </div>

        <Link className="home-action home-action-outline" href="/blog">
          Explorar o Blog
        </Link>
      </section>

      <section className="home-cta">
        <div className="home-cta-copy">
          <p className="home-section-kicker">Próximo passo</p>
          <h2>Vamos construir uma presença digital preparada para evoluir?</h2>
          <p>
            Conheça a Tupiniquim, acompanhe nossos conteúdos e utilize o canal
            institucional conforme a plataforma avança.
          </p>
        </div>

        <Link className="home-action home-action-accent" href="/contato">
          Fale com a Tupiniquim
        </Link>
      </section>

      <style>{`
        .home-page {
          width: 100%;
          color: #111;
          font-family: Arial, Helvetica, sans-serif;
        }

        .home-hero {
          overflow: hidden;
          padding: clamp(64px, 10vw, 128px) clamp(24px, 7vw, 88px);
          background:
            radial-gradient(circle at 86% 18%, rgba(255, 179, 0, 0.24), transparent 28%),
            linear-gradient(120deg, #111 0%, #1b5e20 100%);
          color: #ffffff;
        }

        .home-hero-content {
          max-width: 960px;
        }

        .home-eyebrow,
        .home-section-kicker,
        .home-platform-label {
          margin: 0 0 12px;
          color: #ffb300;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .home-hero h1 {
          max-width: 900px;
          margin: 0;
          font-size: clamp(2.6rem, 6.5vw, 5.8rem);
          line-height: 0.98;
          letter-spacing: -0.05em;
        }

        .home-hero-description {
          max-width: 760px;
          margin: 28px 0 0;
          color: #e7e7e7;
          font-size: clamp(1rem, 2vw, 1.25rem);
          line-height: 1.7;
        }

        .home-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 34px;
        }

        .home-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 12px 20px;
          border: 2px solid transparent;
          border-radius: 6px;
          box-sizing: border-box;
          font-weight: 800;
          line-height: 1.2;
          text-align: center;
          text-decoration: none;
          transition:
            background-color 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .home-action-primary,
        .home-action-accent {
          border-color: #ffb300;
          background: #ffb300;
          color: #111;
        }

        .home-action-primary:hover,
        .home-action-accent:hover {
          border-color: #ffffff;
          background: #ffffff;
          color: #1b5e20;
        }

        .home-action-secondary {
          border-color: rgba(255, 255, 255, 0.7);
          color: #ffffff;
        }

        .home-action-secondary:hover {
          border-color: #ffffff;
          background: #ffffff;
          color: #1b5e20;
        }

        .home-action-outline {
          flex: 0 0 auto;
          border-color: #2e7d32;
          color: #1b5e20;
        }

        .home-action-outline:hover {
          background: #2e7d32;
          color: #ffffff;
        }

        .home-action:focus-visible {
          outline: 3px solid #ffb300;
          outline-offset: 4px;
        }

        .home-solutions,
        .home-differentials,
        .home-platform,
        .home-content,
        .home-cta {
          padding: clamp(52px, 7vw, 92px) clamp(20px, 5vw, 64px);
        }

        .home-solutions,
        .home-platform {
          background: #ffffff;
        }

        .home-section-heading {
          max-width: 820px;
          margin-bottom: 38px;
        }

        .home-section-heading h2,
        .home-content h2,
        .home-cta h2 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.6rem);
          line-height: 1.04;
          letter-spacing: -0.04em;
        }

        .home-section-heading > p:last-child,
        .home-content-copy > p:last-child,
        .home-cta-copy > p:last-child {
          margin: 18px 0 0;
          color: #444;
          line-height: 1.7;
        }

        .home-solutions-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .home-solution-card,
        .home-differential-card {
          min-width: 0;
          padding: 30px;
        }

        .home-solution-card {
          border-top: 5px solid #2e7d32;
          background: #f5f5f5;
        }

        .home-card-number {
          color: #2e7d32;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .home-solution-card h3,
        .home-differential-card h3,
        .home-platform-panel h3 {
          margin: 20px 0 10px;
          font-size: 1.35rem;
          line-height: 1.2;
        }

        .home-solution-card p,
        .home-differential-card p {
          margin: 0;
          color: #444;
          line-height: 1.7;
        }

        .home-differentials {
          background: #111;
          color: #ffffff;
        }

        .home-section-heading-light > p:last-child,
        .home-differential-card p {
          color: #e7e7e7;
        }

        .home-differentials-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          border-left: 1px solid rgba(255, 255, 255, 0.2);
        }

        .home-differential-card {
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .home-differential-card .home-card-number {
          color: #ffb300;
        }

        .home-platform-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }

        .home-platform-panel {
          min-width: 0;
          padding: clamp(26px, 4vw, 42px);
          border: 1px solid #d7d7d7;
        }

        .home-platform-current {
          border-top: 6px solid #2e7d32;
          background: #f5f5f5;
        }

        .home-platform-future {
          border-top: 6px solid #ffb300;
          background: #111;
          color: #ffffff;
        }

        .home-platform-current .home-platform-label {
          color: #2e7d32;
        }

        .home-platform-panel h3 {
          margin-top: 8px;
          font-size: clamp(1.5rem, 3vw, 2.25rem);
        }

        .home-platform-panel ul {
          display: grid;
          gap: 12px;
          margin: 24px 0 0;
          padding: 0;
          list-style: none;
        }

        .home-platform-panel li {
          padding: 12px 0;
          border-bottom: 1px solid #d7d7d7;
          font-weight: 700;
        }

        .home-platform-future li {
          border-bottom-color: rgba(255, 255, 255, 0.18);
        }

        .home-content,
        .home-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 36px;
        }

        .home-content {
          background: #f5f5f5;
        }

        .home-content-copy,
        .home-cta-copy {
          max-width: 780px;
        }

        .home-cta {
          background: #1b5e20;
          color: #ffffff;
        }

        .home-cta-copy > p:last-child {
          color: #e7e7e7;
        }

        @media (max-width: 900px) {
          .home-solutions-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .home-differentials-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .home-platform-grid {
            grid-template-columns: 1fr;
          }

          .home-content,
          .home-cta {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 560px) {
          .home-hero,
          .home-solutions,
          .home-differentials,
          .home-platform,
          .home-content,
          .home-cta {
            padding-right: 20px;
            padding-left: 20px;
          }

          .home-actions,
          .home-solutions-grid,
          .home-differentials-grid {
            grid-template-columns: 1fr;
          }

          .home-actions {
            display: grid;
          }

          .home-action {
            width: 100%;
          }

          .home-solution-card,
          .home-differential-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
