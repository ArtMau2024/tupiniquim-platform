import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer-root">
      <div className="site-footer-inner">
        <div className="site-footer-content">
          <div className="site-footer-institutional">
            <p className="site-footer-brand">Tupiniquim</p>
            <p className="site-footer-description">
              Tecnologia, conteúdo e estratégia para construir soluções digitais
              com identidade brasileira e evolução consistente.
            </p>
          </div>

          <nav
            className="site-footer-navigation"
            aria-label="Navegação do rodapé"
          >
            <p className="site-footer-heading">Navegação</p>
            <ul className="site-footer-list">
              <li>
                <Link className="site-footer-link" href="/">
                  Início
                </Link>
              </li>
              <li>
                <Link className="site-footer-link" href="/#solucoes">
                  Soluções
                </Link>
              </li>
              <li>
                <Link className="site-footer-link" href="/blog">
                  Blog
                </Link>
              </li>
              <li>
                <Link className="site-footer-link" href="/quem-somos">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link className="site-footer-link" href="/contato">
                  Contato
                </Link>
              </li>
            </ul>
          </nav>

          <div className="site-footer-evolution">
            <p className="site-footer-heading">Plataforma em evolução</p>
            <p>
              Novas experiências editoriais, serviços e produtos digitais serão
              incorporados por etapas.
            </p>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© {new Date().getFullYear()} Tupiniquim</p>
        </div>
      </div>

      <style>{`
        .site-footer-root {
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.16);
          background: #111;
          color: #ffffff;
          font-family: Arial, Helvetica, sans-serif;
        }

        .site-footer-inner {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 52px 24px 20px;
          box-sizing: border-box;
        }

        .site-footer-content {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(180px, 0.7fr) minmax(0, 1fr);
          gap: 48px;
          padding-bottom: 40px;
        }

        .site-footer-institutional,
        .site-footer-navigation,
        .site-footer-evolution {
          min-width: 0;
        }

        .site-footer-brand {
          margin: 0;
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          text-decoration: none;
        }

        .site-footer-description {
          max-width: 520px;
          margin: 18px 0 0;
          color: #d7d7d7;
          line-height: 1.7;
        }

        .site-footer-heading {
          margin: 0 0 16px;
          color: #ffb300;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .site-footer-list {
          display: grid;
          gap: 4px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .site-footer-link {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          padding: 7px 0;
          box-sizing: border-box;
          color: #d7d7d7;
          font-weight: 700;
          line-height: 1.3;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .site-footer-link:hover {
          color: #ffb300;
        }

        .site-footer-link:focus-visible {
          outline: 3px solid #ffb300;
          outline-offset: 4px;
        }

        .site-footer-evolution {
          padding: 24px;
          border-left: 5px solid #2e7d32;
          background: rgba(255, 255, 255, 0.05);
        }

        .site-footer-evolution > p:last-child {
          margin: 0;
          color: #d7d7d7;
          line-height: 1.7;
        }

        .site-footer-bottom {
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.16);
          color: #d7d7d7;
          font-size: 0.875rem;
        }

        .site-footer-bottom p {
          margin: 0;
        }

        @media (max-width: 860px) {
          .site-footer-content {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 36px;
          }

          .site-footer-institutional {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 520px) {
          .site-footer-inner {
            padding: 42px 16px 18px;
          }

          .site-footer-content {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .site-footer-institutional {
            grid-column: auto;
          }

          .site-footer-link {
            width: 100%;
          }

          .site-footer-evolution {
            padding: 20px;
          }
        }
      `}</style>
    </footer>
  );
}
