"use client";

import Link from "next/link";

const navItems = [
  { label: "Pagina principal", href: "/" },
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

export default function PublicHeader() {
  return (
    <>
      <header className="swia-header">
        <div className="swia-header-container">
          <Link href="/" className="swia-logo">
            <img src="https://i.imgur.com/6og0aLG.png" alt="SmartWorkIA" />
          </Link>

          <nav className="swia-nav">
            {navItems.map((item) =>
              item.href ? (
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.label} href={item.href}>
                    {item.label}
                  </Link>
                )
              ) : (
                <span key={item.label} aria-disabled="true">
                  {item.label}
                </span>
              )
            )}
          </nav>

          <div className="swia-actions">
            <Link href="/login" className="swia-login-btn">
              Acceder
            </Link>
          </div>
        </div>
      </header>

      <style jsx>{`
        .swia-header {
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #e9edf3;
          box-shadow: 0 2px 10px rgba(22, 44, 75, 0.04);
        }

        .swia-header-container {
          max-width: 1280px;
          margin: 0 auto;
          min-height: 82px;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .swia-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .swia-logo img {
          height: 65px;
          width: auto;
        }

        .swia-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .swia-nav :global(a),
        .swia-nav span {
          text-decoration: none;
          color: #162c4b;
          font-size: 17px;
          font-weight: 600;
          padding: 10px 14px;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .swia-nav :global(a:hover) {
          color: #1e83e4;
          background: rgba(30, 131, 228, 0.06);
        }

        .swia-nav span {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .swia-actions {
          flex-shrink: 0;
        }

        .swia-login-btn {
          text-decoration: none;
          color: #162c4b;
          font-size: 16px;
          font-weight: 700;
          padding: 11px 18px;
          border: 1px solid rgba(22, 44, 75, 0.12);
          border-radius: 12px;
          background: #ffffff;
          transition: all 0.2s ease;
        }

        .swia-login-btn:hover {
          background: #162c4b;
          color: #ffffff;
          border-color: #162c4b;
        }

        @media (max-width: 1100px) {
          .swia-header-container {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
          }

          .swia-nav {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </>
  );
}
