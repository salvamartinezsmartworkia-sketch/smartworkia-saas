"use client";

import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function AccesoPage() {
  return (
    <>
      <PublicHeader />

      <main style={{ margin: 0, padding: 0, background: "#ffffff" }}>
        <section
          style={{
            margin: 0,
            padding: "72px 0 84px",
            background:
              "radial-gradient(circle at top right, rgba(30,131,228,0.10), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 32px",
              display: "grid",
              gridTemplateColumns: "1.08fr 0.92fr",
              gap: "56px",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  marginBottom: "18px",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.14em",
                  color: "#1E83E4",
                }}
              >
                SMARTWORKIA · OPCIONES DE ACCESO
              </span>

              <h1
                style={{
                  fontSize: "56px",
                  lineHeight: "1.05",
                  fontWeight: "800",
                  letterSpacing: "-0.04em",
                  color: "#162C4B",
                  margin: "0 0 22px",
                  maxWidth: "760px",
                }}
              >
                Entra con lógica, crece con criterio y escala con impacto
              </h1>

              <p
                style={{
                  fontSize: "20px",
                  lineHeight: "1.65",
                  color: "#4f5d73",
                  margin: "0 0 32px",
                  maxWidth: "700px",
                }}
              >
                SmartWorkIA no se plantea como tres paquetes cerrados, sino como
                una escalera de adopción: empiezas viendo valor, continúas
                decidiendo mejor y, si encaja, conviertes esa lógica en una
                capacidad propia de tu negocio.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "28px",
                }}
              >
                {[
                  "Finance",
                  "Ops / Supply",
                  "AI Tools",
                  "Decisión ejecutiva",
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "10px 14px",
                      borderRadius: "999px",
                      background: "#ffffff",
                      border: "1px solid #e8edf4",
                      color: "#162C4B",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                  gap: "14px",
                  maxWidth: "720px",
                }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e8edf4",
                    borderRadius: "18px",
                    padding: "18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "800",
                      color: "#162C4B",
                      marginBottom: "6px",
                    }}
                  >
                    Entrada sin fricción
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.65",
                      color: "#5d6980",
                    }}
                  >
                    Puedes empezar con un piloto claro, de bajo riesgo y con una
                    promesa muy concreta de valor visible.
                  </div>
                </div>

                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e8edf4",
                    borderRadius: "18px",
                    padding: "18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "800",
                      color: "#162C4B",
                      marginBottom: "6px",
                    }}
                  >
                    Escalado natural
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.65",
                      color: "#5d6980",
                    }}
                  >
                    Si el cliente ve retorno, el siguiente paso no es comprar
                    “más cosas”, sino subir de nivel de madurez.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  borderRadius: "28px",
                  padding: "34px",
                  background:
                    "linear-gradient(180deg, #162C4B 0%, #0f223b 100%)",
                  boxShadow: "0 24px 60px rgba(22,44,75,0.22)",
                  color: "#ffffff",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.12em",
                    color: "#a8d4ff",
                    marginBottom: "16px",
                  }}
                >
                  MODELO SMARTWORKIA
                </div>

                <div
                  style={{
                    fontSize: "32px",
                    lineHeight: "1.1",
                    fontWeight: "800",
                    marginBottom: "14px",
                  }}
                >
                  Ver antes. Decidir mejor. Operar con menos fricción.
                </div>

                <div
                  style={{
                    fontSize: "17px",
                    lineHeight: "1.6",
                    color: "rgba(255,255,255,0.82)",
                    marginBottom: "30px",
                  }}
                >
                  Un modelo híbrido de entrada, expansión y adaptación para que
                  cada cliente avance según su realidad, no según una etiqueta
                  de software genérico.
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "18px",
                      padding: "16px 14px",
                      textAlign: "center",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        fontSize: "22px",
                        fontWeight: "800",
                        color: "#ffffff",
                        marginBottom: "6px",
                      }}
                    >
                      Starter
                    </strong>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      Piloto / assessment
                    </span>
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "18px",
                      padding: "16px 14px",
                      textAlign: "center",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        fontSize: "22px",
                        fontWeight: "800",
                        color: "#ffffff",
                        marginBottom: "6px",
                      }}
                    >
                      Pro
                    </strong>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      Suscripción de decisión
                    </span>
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "18px",
                      padding: "16px 14px",
                      textAlign: "center",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        fontSize: "22px",
                        fontWeight: "800",
                        color: "#ffffff",
                        marginBottom: "6px",
                      }}
                    >
                      Enterprise
                    </strong>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      Sistema adaptado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "14px 0 90px", background: "#ffffff" }}>
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 32px",
            }}
          >
            <div
              style={{
                marginBottom: "28px",
                maxWidth: "980px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  marginBottom: "12px",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.14em",
                  color: "#1E83E4",
                }}
              >
                ESCALERA DE ADOPCIÓN
              </span>

              <h2
                style={{
                  fontSize: "38px",
                  lineHeight: "1.12",
                  fontWeight: "800",
                  letterSpacing: "-0.03em",
                  color: "#162C4B",
                  margin: "0 0 14px",
                }}
              >
                Empieza con un quick win, consolida una capa de decisión y escala
                solo si el negocio lo justifica
              </h2>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.7",
                  color: "#5d6980",
                  margin: 0,
                  maxWidth: "900px",
                }}
              >
                Este modelo reduce fricción de entrada, acelera la percepción de
                valor y permite crecer por madurez, no por presión comercial.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "22px",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8edf4",
                  borderRadius: "24px",
                  padding: "28px",
                  boxShadow: "0 14px 34px rgba(22,44,75,0.06)",
                  transition:
                    "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 24px 48px rgba(22,44,75,0.12)";
                  e.currentTarget.style.borderColor = "#cfe3f8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 34px rgba(22,44,75,0.06)";
                  e.currentTarget.style.borderColor = "#e8edf4";
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: "#eef6ff",
                    color: "#1E83E4",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    marginBottom: "18px",
                  }}
                >
                  STARTER · PILOTO / ASSESSMENT
                </div>

                <h3
                  style={{
                    fontSize: "30px",
                    lineHeight: "1.05",
                    color: "#162C4B",
                    margin: "0 0 12px",
                    fontWeight: "800",
                  }}
                >
                  Empieza a ver lo que hoy no estás viendo
                </h3>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "#5d6980",
                    margin: "0 0 18px",
                  }}
                >
                  Una entrada clara, rápida y de bajo riesgo para detectar
                  tensiones, anomalías y primeras oportunidades con lógica real
                  de negocio.
                </p>

                <ul
                  style={{
                    margin: "0 0 22px",
                    paddingLeft: "18px",
                    color: "#162C4B",
                    lineHeight: "1.9",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  <li>Diagnóstico o caso de uso acotado</li>
                  <li>Quick wins y primeras lecturas accionables</li>
                  <li>Valor visible sin gran fricción de entrada</li>
                </ul>

                <a
                  href="/starter"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "50px",
                    width: "100%",
                    borderRadius: "14px",
                    fontSize: "15px",
                    fontWeight: "700",
                    textDecoration: "none",
                    background: "#162C4B",
                    color: "#ffffff",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1E83E4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#162C4B";
                  }}
                >
                  Explorar Starter
                </a>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  border: "2px solid #1E83E4",
                  borderRadius: "24px",
                  padding: "28px",
                  boxShadow: "0 18px 40px rgba(30,131,228,0.12)",
                  position: "relative",
                  transition:
                    "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-10px) scale(1.01)";
                  e.currentTarget.style.boxShadow =
                    "0 28px 56px rgba(30,131,228,0.18)";
                  e.currentTarget.style.borderColor = "#0f6fd1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 40px rgba(30,131,228,0.12)";
                  e.currentTarget.style.borderColor = "#1E83E4";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    right: "18px",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "7px 12px",
                    borderRadius: "999px",
                    background: "#1E83E4",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    boxShadow: "0 10px 24px rgba(30,131,228,0.18)",
                  }}
                >
                  CAPA RECURRENTE
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: "#eef6ff",
                    color: "#1E83E4",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    marginBottom: "18px",
                  }}
                >
                  PRO · SUSCRIPCIÓN DE DECISIÓN
                </div>

                <h3
                  style={{
                    fontSize: "30px",
                    lineHeight: "1.05",
                    color: "#162C4B",
                    margin: "0 0 12px",
                    fontWeight: "800",
                  }}
                >
                  Pasa de mirar datos a decidir mejor
                </h3>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "#5d6980",
                    margin: "0 0 18px",
                  }}
                >
                  Aquí SmartWorkIA empieza a trabajar de verdad contigo:
                  simulación, priorización, visibilidad continua y una capa de
                  criterio que ayuda a decidir mejor.
                </p>

                <ul
                  style={{
                    margin: "0 0 22px",
                    paddingLeft: "18px",
                    color: "#162C4B",
                    lineHeight: "1.9",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  <li>Uso continuo con lógica de decisión</li>
                  <li>Escenarios, priorización y foco en ROI</li>
                  <li>Escalable por dominios, áreas o necesidades</li>
                </ul>

                <a
                  href="/pro"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "50px",
                    width: "100%",
                    borderRadius: "14px",
                    fontSize: "15px",
                    fontWeight: "700",
                    textDecoration: "none",
                    background: "#1E83E4",
                    color: "#ffffff",
                    boxShadow: "0 10px 30px rgba(30,131,228,0.18)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#162C4B";
                    e.currentTarget.style.boxShadow =
                      "0 14px 34px rgba(22,44,75,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1E83E4";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(30,131,228,0.18)";
                  }}
                >
                  Explorar Pro
                </a>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8edf4",
                  borderRadius: "24px",
                  padding: "28px",
                  boxShadow: "0 14px 34px rgba(22,44,75,0.06)",
                  transition:
                    "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 24px 48px rgba(22,44,75,0.12)";
                  e.currentTarget.style.borderColor = "#d6efe6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 34px rgba(22,44,75,0.06)";
                  e.currentTarget.style.borderColor = "#e8edf4";
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: "#edf9f3",
                    color: "#1f8f63",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    marginBottom: "18px",
                  }}
                >
                  ENTERPRISE · SISTEMA ADAPTADO
                </div>

                <h3
                  style={{
                    fontSize: "30px",
                    lineHeight: "1.05",
                    color: "#162C4B",
                    margin: "0 0 12px",
                    fontWeight: "800",
                  }}
                >
                  Convierte esta lógica en una capacidad propia
                </h3>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "#5d6980",
                    margin: "0 0 18px",
                  }}
                >
                  Para organizaciones que ya no buscan solo acceso, sino adaptar
                  métricas, reglas, datos y flujos a su realidad para operar con
                  más solidez y menos fricción.
                </p>

                <ul
                  style={{
                    margin: "0 0 22px",
                    paddingLeft: "18px",
                    color: "#162C4B",
                    lineHeight: "1.9",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  <li>Integración, personalización y gobernanza</li>
                  <li>Despliegue como capacidad interna real</li>
                  <li>Proyecto, retainer y evolución a medida</li>
                </ul>

                <a
                  href="/enterprise"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "50px",
                    width: "100%",
                    borderRadius: "14px",
                    fontSize: "15px",
                    fontWeight: "700",
                    textDecoration: "none",
                    background: "#162C4B",
                    color: "#ffffff",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1f8f63";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#162C4B";
                  }}
                >
                  Explorar Enterprise
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            padding: "0 0 92px",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 32px",
            }}
          >
            <div
              style={{
                borderRadius: "28px",
                padding: "34px",
                background:
                  "linear-gradient(180deg, #162C4B 0%, #10233c 100%)",
                boxShadow: "0 24px 60px rgba(22,44,75,0.18)",
                color: "#ffffff",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.15fr 0.85fr",
                  gap: "28px",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      letterSpacing: "0.12em",
                      color: "#a8d4ff",
                      marginBottom: "14px",
                    }}
                  >
                    AÚN NO LO TIENES CLARO
                  </div>

                  <h3
                    style={{
                      fontSize: "34px",
                      lineHeight: "1.08",
                      fontWeight: "800",
                      margin: "0 0 14px",
                    }}
                  >
                    Si todavía no sabes por dónde entrar, lo ordenamos contigo
                  </h3>

                  <p
                    style={{
                      fontSize: "17px",
                      lineHeight: "1.65",
                      color: "rgba(255,255,255,0.82)",
                      margin: 0,
                    }}
                  >
                    Puedes empezar por una conversación simple y definir si tu
                    caso encaja mejor como piloto, como capa recurrente de
                    decisión o como sistema adaptado.
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <a
                    href="https://www.smartworkia.com/contacto"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "54px",
                      padding: "0 24px",
                      borderRadius: "14px",
                      fontSize: "16px",
                      fontWeight: "700",
                      textDecoration: "none",
                      background: "#1E83E4",
                      color: "#ffffff",
                      boxShadow: "0 10px 30px rgba(30,131,228,0.22)",
                    }}
                  >
                    Ir a contacto
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}