"use client";

import Link from "next/link";

const navigationLinks = [
  { label: "Inicio", href: "/" },
  { label: "Recursos" },
  { label: "Sobre mi" },
  {
    label: "Diagnostico",
    href: "https://www.smartworkia.com/diagnostico",
    external: true,
  },
  {
    label: "Blog",
    href: "https://www.smartworkia.com/blog",
    external: true,
  },
];

const accessLinks = [
  { label: "Zona privada", href: "/login" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Herramientas", href: "/dashboard" },
];

function FooterLink({ item }) {
  if (!item.href) {
    return (
      <span aria-disabled="true" className="swia-footer-disabled">
        {item.label}
      </span>
    );
  }

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {item.label}
      </a>
    );
  }

  return <Link href={item.href}>{item.label}</Link>;
}

export default function PublicFooter() {
  return (
    <>
      <footer className="swia-footer">
        <div className="swia-footer-container">
          <div className="swia-footer-top">
            <div className="swia-footer-brand">
              <Link href="/" className="swia-footer-logo">
                <img src="https://i.imgur.com/6og0aLG.png" alt="SmartWorkIA" />
              </Link>

              <p className="swia-footer-text">
                Inteligencia Artificial Aplicada para convertir ideas, procesos y
                datos en decisiones mas inteligentes.
              </p>
            </div>

            <div className="swia-footer-links">
              <div className="swia-footer-column">
                <span className="swia-footer-title">Navegacion</span>
                {navigationLinks.map((item) => (
                  <FooterLink key={item.label} item={item} />
                ))}
              </div>

              <div className="swia-footer-column">
                <span className="swia-footer-title">Acceso</span>
                {accessLinks.map((item) => (
                  <FooterLink key={item.label} item={item} />
                ))}
              </div>

              <div className="swia-footer-column">
                <span className="swia-footer-title">SmartWorkIA</span>
                <span className="swia-footer-note">
                  Plataforma privada para clientes, recursos, diagnosticos y
                  herramientas inteligentes.
                </span>
              </div>
            </div>
          </div>

          <div className="swia-footer-bottom">
            <span>© 2026 SmartWorkIA. Todos los derechos reservados.</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .swia-footer {
          background: #162c4b;
          color: #ffffff;
          margin-top: 0;
        }

        .swia-footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 32px 24px;
        }

        .swia-footer-top {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: start;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .swia-footer-brand {
          max-width: 520px;
        }

        .swia-footer-logo {
          display: inline-flex;
          text-decoration: none;
          margin-bottom: 20px;
        }

        .swia-footer-logo img {
          height: 72px;
          width: auto;
          display: block;
        }

        .swia-footer-text {
          margin: 0;
          font-size: 22px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.86);
          max-width: 560px;
        }

        .swia-footer-links {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }

        .swia-footer-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .swia-footer-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #a8d4ff;
          margin-bottom: 6px;
        }

        .swia-footer-column :global(a),
        .swia-footer-disabled {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .swia-footer-column :global(a:hover) {
          color: #ffffff;
        }

        .swia-footer-disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .swia-footer-note {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.72);
        }

        .swia-footer-bottom {
          padding-top: 20px;
          display: flex;
          justify-content: flex-start;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.62);
        }

        @media (max-width: 1100px) {
          .swia-footer-top {
            grid-template-columns: 1fr;
          }

          .swia-footer-links {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 700px) {
          .swia-footer-container {
            padding: 42px 20px 22px;
          }

          .swia-footer-text {
            font-size: 18px;
          }

          .swia-footer-links {
            grid-template-columns: 1fr;
          }

          .swia-footer-bottom {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
