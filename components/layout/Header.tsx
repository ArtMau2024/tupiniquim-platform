import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header-root">
      <nav className="site-header-inner" aria-label="Navegação principal">
        <Link className="site-header-brand" href="/">
          Tupiniquim
        </Link>

        <ul className="site-header-list">
          <li>
            <Link className="site-header-link" href="/">
              Início
            </Link>
          </li>
          <li>
            <Link className="site-header-link" href="/#solucoes">
              Soluções
            </Link>
          </li>
          <li>
            <Link className="site-header-link" href="/blog">
              Blog
            </Link>
          </li>
          <li>
            <Link className="site-header-link" href="/quem-somos">
              Quem Somos
            </Link>
          </li>
          <li>
            <Link className="site-header-link" href="/contato">
              Contato
            </Link>
          </li>
        </ul>

        <Link className="site-header-contact" href="/contato">
          Fale Conosco
        </Link>
      </nav>

      <style>{`
        .site-header-root {
          position: relative;
          z-index: 50;
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          background: #111;
          color: #ffffff;
          font-family: Arial, Helvetica, sans-serif;
        }

        .site-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          width: 100%;
          max-width: 1400px;
          min-height: 68px;
          margin: 0 auto;
          padding: 12px 24px;
          box-sizing: border-box;
        }

        .site-header-brand {
          flex: 0 0 auto;
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          text-decoration: none;
        }

        .site-header-list {
          display: flex;
          flex: 1 1 auto;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .site-header-link,
        .site-header-contact {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          border-radius: 6px;
          font-weight: 700;
          line-height: 1.2;
          text-decoration: none;
          transition:
            background-color 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
        }

        .site-header-link {
          padding: 9px 12px;
          color: #e7e7e7;
        }

        .site-header-link:hover {
          background: rgba(46, 125, 50, 0.2);
          color: #ffffff;
        }

        .site-header-contact {
          flex: 0 0 auto;
          padding: 10px 16px;
          border: 1px solid #ffb300;
          background: #ffb300;
          color: #111;
        }

        .site-header-contact:hover {
          border-color: #2e7d32;
          background: #2e7d32;
          color: #ffffff;
        }

        .site-header-brand:focus-visible,
        .site-header-link:focus-visible,
        .site-header-contact:focus-visible {
          outline: 3px solid #ffb300;
          outline-offset: 3px;
        }

        @media (max-width: 860px) {
          .site-header-inner {
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 12px 18px;
            padding-top: 14px;
            padding-bottom: 14px;
          }

          .site-header-list {
            order: 3;
            flex-basis: 100%;
            justify-content: flex-start;
          }

          .site-header-contact {
            margin-left: auto;
          }
        }

        @media (max-width: 520px) {
          .site-header-inner {
            padding-right: 16px;
            padding-left: 16px;
          }

          .site-header-brand,
          .site-header-contact {
            width: 100%;
          }

          .site-header-contact {
            margin-left: 0;
          }

          .site-header-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            width: 100%;
          }

          .site-header-link {
            width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>
    </header>
  );
}
