import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function Home() {
  return (
    <>
      <PublicHeader />

      <main style={{ margin: 0, padding: 0, background: "#ffffff" }}>
        <section
          style={{
            margin: 0,
            padding: "72px 0 80px",
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
              gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)",
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
                SMARTWORKIA · ZONA DE ACCESO
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
                Convierte ideas, procesos y datos en{" "}
                <span style={{ color: "#1E83E4" }}>
                  decisiones más inteligentes
                </span>
              </h1>

              <p
                style={{
                  fontSize: "20px",
                  lineHeight: "1.65",
                  color: "#4f5d73",
                  margin: "0 0 32px",
                  maxWidth: "680px",
                }}
              >
                Accede a herramientas, diagnósticos, simuladores y recursos
                diseñados para mejorar productividad, control, liquidez, margen
                y capacidad real de decisión.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "26px",
                }}
              >
                <a
                  href="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "52px",
                    padding: "0 24px",
                    borderRadius: "14px",
                    fontSize: "16px",
                    fontWeight: "700",
                    textDecoration: "none",
                    background: "#162C4B",
                    color: "#ffffff",
                    boxShadow: "0 10px 30px rgba(22,44,75,0.16)",
                  }}
                >
                  Acceder a la zona privada
                </a>

                <a
                  href="https://www.smartworkia.com/diagnostico"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "52px",
                    padding: "0 24px",
                    borderRadius: "14px",
                    fontSize: "16px",
                    fontWeight: "700",
                    textDecoration: "none",
                    background: "#ffffff",
                    color: "#162C4B",
                    border: "1px solid rgba(22,44,75,0.12)",
                  }}
                >
                  Explorar diagnóstico
                </a>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {[
                  "Herramientas",
                  "Diagnósticos",
                  "Simuladores",
                  "Productividad",
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
                  ENTORNO SMARTWORKIA
                </div>

                <div
                  style={{
                    fontSize: "32px",
                    lineHeight: "1.1",
                    fontWeight: "800",
                    marginBottom: "14px",
                  }}
                >
                  Un centro de trabajo orientado a valor real
                </div>

                <div
                  style={{
                    fontSize: "17px",
                    lineHeight: "1.6",
                    color: "rgba(255,255,255,0.82)",
                    marginBottom: "30px",
                  }}
                >
                  Herramientas para analizar escenarios, detectar tensiones,
                  priorizar acciones y convertir complejidad en decisiones
                  ejecutivas claras.
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
                      Finance
                    </strong>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      Caja · margen · riesgo
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
                      Ops
                    </strong>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      Supply · compras · control
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
                      AI
                    </strong>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      Automatización y decisión
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "28px 0 34px", background: "#ffffff" }}>
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
                maxWidth: "900px",
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
                QUÉ ENCUENTRAS DENTRO
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
                Un ecosistema pensado para trabajar, analizar y decidir mejor
              </h2>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.7",
                  color: "#5d6980",
                  margin: 0,
                  maxWidth: "860px",
                }}
              >
                SmartWorkIA reúne herramientas ejecutivas, diagnósticos, marcos
                aplicados y sistemas de trabajo para convertir conocimiento en
                acción con una lógica mucho más útil.
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: "0 0 80px", background: "#ffffff" }}>
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 32px",
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "20px",
            }}
          >
            {[
              {
                title: "Herramientas inteligentes",
                text: "Accede a sistemas pensados para ayudarte a decidir mejor, interpretar tensiones y actuar con más claridad.",
              },
              {
                title: "Diagnósticos y simuladores",
                text: "Evalúa escenarios, detecta oportunidades, mide impacto y prioriza acciones con una lógica más ejecutiva.",
              },
              {
                title: "Recursos aplicados",
                text: "Encuentra materiales, marcos y piezas útiles para convertir ideas, datos y contexto en decisiones reales.",
              },
              {
                title: "Entorno privado",
                text: "Centraliza acceso a contenidos, activos y próximas funcionalidades dentro de un ecosistema ordenado y útil.",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8edf4",
                  borderRadius: "22px",
                  padding: "24px",
                  boxShadow: "0 10px 30px rgba(22,44,75,0.05)",
                }}
              >
                <h3
                  style={{
                    fontSize: "22px",
                    lineHeight: "1.2",
                    color: "#162C4B",
                    margin: "0 0 12px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.65",
                    color: "#5d6980",
                    margin: 0,
                  }}
                >
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: "10px 0 90px",
            background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
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
                maxWidth: "920px",
                marginBottom: "28px",
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
                LÍNEAS PRINCIPALES
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
                Tres bloques para convertir complejidad en acción útil
              </h2>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.7",
                  color: "#5d6980",
                  margin: 0,
                  maxWidth: "860px",
                }}
              >
                El ecosistema SmartWorkIA se organiza en áreas que responden a
                problemas reales de negocio: caja, margen, riesgo, operaciones,
                supply chain, automatización y capacidad de decisión.
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
                  FINANCE
                </div>

                <h3
                  style={{
                    fontSize: "28px",
                    lineHeight: "1.15",
                    color: "#162C4B",
                    margin: "0 0 14px",
                    fontWeight: "800",
                  }}
                >
                  Tesorería, margen y riesgo financiero
                </h3>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "#5d6980",
                    margin: "0 0 18px",
                  }}
                >
                  Simuladores y herramientas para entender caja, tensión de
                  circulante, cobertura, forecasting y vulnerabilidades que
                  erosionan rentabilidad.
                </p>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "18px",
                    color: "#162C4B",
                    lineHeight: "1.9",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  <li>Tesorería y ciclo de caja</li>
                  <li>Forecasting y escenarios</li>
                  <li>Margen, cobertura y defensa financiera</li>
                </ul>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8edf4",
                  borderRadius: "24px",
                  padding: "28px",
                  boxShadow: "0 14px 34px rgba(22,44,75,0.06)",
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
                  OPS / SUPPLY
                </div>

                <h3
                  style={{
                    fontSize: "28px",
                    lineHeight: "1.15",
                    color: "#162C4B",
                    margin: "0 0 14px",
                    fontWeight: "800",
                  }}
                >
                  Operaciones, compras y supply chain
                </h3>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "#5d6980",
                    margin: "0 0 18px",
                  }}
                >
                  Herramientas para detectar tensiones antes de que se conviertan
                  en retrasos, roturas, sobrecostes o pérdida de control
                  operativo.
                </p>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "18px",
                    color: "#162C4B",
                    lineHeight: "1.9",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  <li>Control tower y alertas operativas</li>
                  <li>Riesgo de proveedores y compras</li>
                  <li>Visibilidad ejecutiva para decisión rápida</li>
                </ul>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8edf4",
                  borderRadius: "24px",
                  padding: "28px",
                  boxShadow: "0 14px 34px rgba(22,44,75,0.06)",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: "#f3efff",
                    color: "#6c4dd9",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    marginBottom: "18px",
                  }}
                >
                  AI TOOLS
                </div>

                <h3
                  style={{
                    fontSize: "28px",
                    lineHeight: "1.15",
                    color: "#162C4B",
                    margin: "0 0 14px",
                    fontWeight: "800",
                  }}
                >
                  Automatización, copilotos y sistemas de decisión
                </h3>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "#5d6980",
                    margin: "0 0 18px",
                  }}
                >
                  Activos pensados para transformar lógica de negocio, contexto y
                  prompts en herramientas visuales, flujos de trabajo y apoyo
                  real a la decisión.
                </p>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "18px",
                    color: "#162C4B",
                    lineHeight: "1.9",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  <li>Copilotos de decisión</li>
                  <li>Automatización y reutilización</li>
                  <li>IA aplicada a procesos reales</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            padding: "0 0 96px",
            background: "#f8fbff",
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
                background: "linear-gradient(135deg, #162C4B 0%, #1c3559 100%)",
                borderRadius: "28px",
                padding: "42px 40px",
                boxShadow: "0 24px 60px rgba(22,44,75,0.18)",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "28px",
                alignItems: "center",
              }}
            >
              <div>
                <span
                  style={{
                    display: "inline-block",
                    marginBottom: "12px",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.14em",
                    color: "#9fd0ff",
                  }}
                >
                  SIGUIENTE PASO
                </span>

                <h2
                  style={{
                    fontSize: "36px",
                    lineHeight: "1.12",
                    fontWeight: "800",
                    letterSpacing: "-0.03em",
                    color: "#ffffff",
                    margin: "0 0 14px",
                    maxWidth: "760px",
                  }}
                >
                  Entra en la zona privada y empieza a trabajar con lógica de valor real
                </h2>

                <p
                  style={{
                    fontSize: "17px",
                    lineHeight: "1.7",
                    color: "rgba(255,255,255,0.82)",
                    margin: 0,
                    maxWidth: "760px",
                  }}
                >
                  Accede a simuladores, herramientas y entornos creados para
                  ayudarte a diagnosticar, priorizar y decidir con mucha más
                  claridad.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px",
                  justifyContent: "flex-end",
                }}
              >
                <a
                  href="/login"
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
                    boxShadow: "0 12px 30px rgba(30,131,228,0.22)",
                  }}
                >
                  Acceder ahora
                </a>

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
                    background: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  Contactar
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}