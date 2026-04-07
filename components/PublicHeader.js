"use client";

export default function PublicHeader() {
  return (
    <>
      <header className="swia-header">
        <div className="swia-header-container">
          <a href="/" className="swia-logo">
            <img src="https://i.imgur.com/6og0aLG.png" alt="SmartWorkIA" />
          </a>

          <nav className="swia-nav">
            <a href="/">Página principal</a>
            <a href="/recursos">Recursos</a>
            <a href="/sobre-mi">Sobre mí</a>
            <a href="/diagnostico">Diagnóstico</a>
            <a href="/blog">Blog</a>
          </nav>

          <div className="swia-actions">
            <a href="/login" className="swia-login-btn">
              Acceder
            </a>
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

        .swia-nav a {
          text-decoration: none;
          color: #162c4b;
          font-size: 17px;
          font-weight: 600;
          padding: 10px 14px;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .swia-nav a:hover {
          color: #1e83e4;
          background: rgba(30, 131, 228, 0.06);
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