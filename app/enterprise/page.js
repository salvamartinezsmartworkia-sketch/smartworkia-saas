"use client";

import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function EnterprisePage() {
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
                SMARTWORKIA · ENTERPRISE
              </span>

              <h1
                style={{
                  fontSize: "56px",
                  lineHeight: "1.05",
                  fontWeight: "800",
                  letterSpacing: "-0.04em",
                  color: "#162C4B",
                  margin: "0 0 22px",
                  maxWidth: "840px",
                }}
              >
                Cuando ya no buscas una herramienta,
                <span style={{ color: "#1E83E4" }}>
                  {" "}buscas una capacidad propia
                </span>
              </h1>

              <p
                style={{
                  fontSize: "20px",
                  lineHeight: "1.65",
                  color: "#4f5d73",
                  margin: "0 0 32px",
                  maxWidth: "740px",
                }}
              >
                Enterprise está pensado para organizaciones que necesitan algo
                más serio que acceso: una lógica adaptada a su negocio, conectada
                con sus datos, sus procesos y su forma real de decidir.
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
                  "Integración",
                  "Gobernanza",
                  "Sistema propio",
                  "Escalabilidad real",
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
                  maxWidth: "780px",
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
                    Qué resuelve aquí
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.65",
                      color: "#5d6980",
                    }}
                  >
                    Convierte una lógica externa en una capacidad interna:
                    métricas, reglas, flujos y decisiones alineadas con la
                    realidad específica de tu organización.
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
                    Por qué entrar aquí
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.65",
                      color: "#5d6980",
                    }}
                  >
                    Porque cuando el problema ya afecta a varias áreas, equipos
                    o decisiones críticas, necesitas algo que encaje con tu
                    negocio y no una capa genérica que se quede corta.
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
                  QUÉ PASA EN ENTERPRISE
                </div>

                <div
                  style={{
                    fontSize: "32px",
                    lineHeight: "1.1",
                    fontWeight: "800",
                    marginBottom: "14px",
                  }}
                >
                  Aquí SmartWorkIA deja de ser una capa de acceso y empieza a
                  convertirse en sistema
                </div>

                <div
                  style={{
                    fontSize: "17px",
                    lineHeight: "1.6",
                    color: "rgba(255,255,255,0.82)",
                    marginBottom: "30px",
                  }}
                >
                  Enterprise no se compra por curiosidad. Se activa cuando hay
                  suficiente complejidad, presión o ambición como para querer una
                  lógica de decisión integrada, gobernable y escalable.
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
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "#ffffff",
                        marginBottom: "6px",
                      }}
                    >
                      1
                    </strong>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      Adaptar
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
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "#ffffff",
                        marginBottom: "6px",
                      }}
                    >
                      2
                    </strong>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      Integrar
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
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "#ffffff",
                        marginBottom: "6px",
                      }}
                    >
                      3
                    </strong>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      Gobernar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "8px 0 64px", background: "#ffffff" }}>
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 32px",
            }}
          >
            <div
              style={{
                maxWidth: "960px",
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
                SISTEMA ADAPTADO
              </span>

              <h2
                style={{
                  fontSize: "38px",
                  lineHeight: "1.12",
                  fontWeight: "800",
                  letterSpacing: "-0.03em",
                  color: "#162C4B",
                  margin: "0 0 14px",
                  maxWidth: "940px",
                }}
              >
                Cuando varias áreas dependen de la misma lectura, la solución ya
                no puede ser genérica
              </h2>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.7",
                  color: "#5d6980",
                  margin: 0,
                  maxWidth: "880px",
                }}
              >
                Enterprise está diseñado para integrarse con la lógica real del
                negocio: fuentes de datos, métricas críticas, workflows,
                trazabilidad, criterios internos y necesidades de gobierno.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.25fr 0.75fr",
                gap: "22px",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                  border: "1px solid #e8edf4",
                  borderRadius: "28px",
                  padding: "26px",
                  boxShadow: "0 18px 40px rgba(22,44,75,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "18px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        letterSpacing: "0.12em",
                        color: "#1E83E4",
                        marginBottom: "8px",
                      }}
                    >
                      MOCKUP · ENTERPRISE CONTROL LAYER
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        lineHeight: "1.1",
                        fontWeight: "800",
                        color: "#162C4B",
                      }}
                    >
                      Lectura integrada, trazable y gobernable
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "999px",
                      background: "#edf9f3",
                      border: "1px solid #dbeee5",
                      color: "#1f8f63",
                      fontSize: "13px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Nivel Enterprise
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gap: "14px",
                    marginBottom: "16px",
                  }}
                >
                  {[
                    ["Dominios conectados", "4"],
                    ["Workflows críticos", "11"],
                    ["Riesgo residual", "-31%"],
                    ["Trazabilidad", "100%"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e8edf4",
                        borderRadius: "18px",
                        padding: "16px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6b778c",
                          marginBottom: "8px",
                          fontWeight: "600",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: "30px",
                          lineHeight: "1",
                          color: "#162C4B",
                          fontWeight: "800",
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e8edf4",
                    borderRadius: "22px",
                    padding: "18px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "800",
                      color: "#162C4B",
                      marginBottom: "14px",
                    }}
                  >
                    Flujo integrado de decisión
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4,1fr)",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    {[
                      "ERP / Data",
                      "Modelo de reglas",
                      "Motor de lectura",
                      "Decisión / acción",
                    ].map((step, i) => (
                      <div
                        key={step}
                        style={{
                          minHeight: "88px",
                          borderRadius: "18px",
                          background:
                            i === 2
                              ? "linear-gradient(180deg, #1E83E4 0%, #243a63 100%)"
                              : "#f8fbff",
                          border:
                            i === 2
                              ? "1px solid rgba(30,131,228,0.18)"
                              : "1px solid #e8edf4",
                          color: i === 2 ? "#ffffff" : "#162C4B",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          padding: "12px",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e8edf4",
                      borderRadius: "18px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "800",
                        color: "#162C4B",
                        marginBottom: "10px",
                      }}
                    >
                      Capacidades activadas
                    </div>
                    {[
                      "Gobernanza de decisión",
                      "Integración con sistemas",
                      "Adaptación por negocio",
                    ].map((item, i) => (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "9px 0",
                          borderTop: i === 0 ? "none" : "1px solid #eef2f7",
                          fontSize: "14px",
                          color: "#162C4B",
                          fontWeight: "600",
                        }}
                      >
                        <span>{item}</span>
                        <span
                          style={{
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background: "#edf9f3",
                            color: "#1f8f63",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          Activo
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e8edf4",
                      borderRadius: "18px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "800",
                        color: "#162C4B",
                        marginBottom: "10px",
                      }}
                    >
                      Lectura estratégica
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.75",
                        color: "#5d6980",
                      }}
                    >
                      La lógica deja de depender de una persona o de una lectura
                      aislada y pasa a instalarse como una capacidad repetible,
                      trazable y escalable dentro de la organización.
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateRows: "1fr 1fr",
                  gap: "22px",
                }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e8edf4",
                    borderRadius: "24px",
                    padding: "22px",
                    boxShadow: "0 14px 34px rgba(22,44,75,0.05)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      letterSpacing: "0.12em",
                      color: "#1E83E4",
                      marginBottom: "12px",
                    }}
                  >
                    MOCKUP · GOBERNANZA
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      lineHeight: "1.15",
                      fontWeight: "800",
                      color: "#162C4B",
                      marginBottom: "14px",
                    }}
                  >
                    Trazabilidad, control y criterio compartido
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    {[
                      ["Reglas documentadas", "#e7f8ef", "#1f8f63"],
                      ["Riesgos auditables", "#dbeafe", "#1d4ed8"],
                      ["Decisiones justificables", "#eef2ff", "#4338ca"],
                    ].map(([text, bg, color]) => (
                      <div
                        key={text}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "16px",
                          background: bg,
                          color,
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        {text}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "linear-gradient(180deg, #162C4B 0%, #0f223b 100%)",
                    border: "1px solid rgba(22,44,75,0.08)",
                    borderRadius: "24px",
                    padding: "22px",
                    boxShadow: "0 18px 40px rgba(22,44,75,0.12)",
                    color: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      letterSpacing: "0.12em",
                      color: "#a8d4ff",
                      marginBottom: "12px",
                    }}
                  >
                    MOCKUP · DESPLIEGUE
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      lineHeight: "1.15",
                      fontWeight: "800",
                      marginBottom: "14px",
                    }}
                  >
                    De solución puntual a capacidad instalada
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    {[
                      "1. Diseñar lógica adaptada",
                      "2. Conectar datos y flujos",
                      "3. Desplegar y evolucionar",
                    ].map((step) => (
                      <div
                        key={step}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "16px",
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          color: "#ffffff",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        {step}
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: "16px",
                      fontSize: "13px",
                      lineHeight: "1.7",
                      color: "rgba(255,255,255,0.72)",
                    }}
                  >
                    Aquí el retorno ya no es solo ahorro puntual. Es una forma
                    mejor de decidir y operar durante mucho tiempo.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "8px 0 50px", background: "#ffffff" }}>
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 32px",
            }}
          >
            <div
              style={{
                maxWidth: "960px",
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
                LO QUE DESBLOQUEAS
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
                Una capacidad que deja de depender de intuición dispersa y pasa a
                vivir dentro del negocio
              </h2>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.7",
                  color: "#5d6980",
                  margin: 0,
                  maxWidth: "880px",
                }}
              >
                Enterprise está pensado para organizaciones que necesitan una
                lógica de decisión más sólida, integrada y preparada para escalar
                con control.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "20px",
              }}
            >
              {[
                {
                  title: "Adaptación real",
                  text: "La solución se ajusta a tu estructura, tus métricas, tus flujos y tus necesidades de lectura.",
                },
                {
                  title: "Integración útil",
                  text: "No se queda como capa aislada: conversa con datos, sistemas y procesos que ya existen en tu operación.",
                },
                {
                  title: "Gobierno y trazabilidad",
                  text: "Las decisiones dejan rastro, se explican mejor y se sostienen con más consistencia interna.",
                },
                {
                  title: "Escalabilidad seria",
                  text: "Lo que hoy resuelve un frente concreto puede evolucionar después como una capacidad transversal.",
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
                      fontWeight: "800",
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
          </div>
        </section>

        <section style={{ padding: "0 0 90px", background: "#ffffff" }}>
          <div
            style={{
              maxWidth: "980px",
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
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.12em",
                  color: "#a8d4ff",
                  marginBottom: "14px",
                }}
              >
                SIGUIENTE PASO
              </div>

              <h3
                style={{
                  fontSize: "34px",
                  lineHeight: "1.08",
                  fontWeight: "800",
                  margin: "0 0 14px",
                }}
              >
                Agenda una conversación estratégica y vemos si Enterprise debe
                convertirse en tu siguiente movimiento serio
              </h3>

              <p
                style={{
                  fontSize: "17px",
                  lineHeight: "1.65",
                  color: "rgba(255,255,255,0.82)",
                  margin: "0 0 26px",
                  maxWidth: "780px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Esta conversación está pensada para revisar tu contexto real,
                nivel de complejidad, integración necesaria y ambición de
                despliegue. Aquí ya no hablamos de curiosidad. Hablamos de
                capacidad, gobierno y transformación.
              </p>

              <div
                style={{
                  maxWidth: "520px",
                  margin: "0 auto 18px",
                  textAlign: "center",
                }}
              >
                <a
                  href="https://www.smartworkia.com/reserva-enterprise"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "58px",
                    padding: "0 28px",
                    borderRadius: "16px",
                    fontSize: "17px",
                    fontWeight: "700",
                    textDecoration: "none",
                    background: "#1E83E4",
                    color: "#ffffff",
                    boxShadow:
                      "0 0 0 10px rgba(30,131,228,0.10), 0 10px 30px rgba(30,131,228,0.22)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#3a92ea";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 12px rgba(30,131,228,0.14), 0 14px 36px rgba(30,131,228,0.28)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1E83E4";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 10px rgba(30,131,228,0.10), 0 10px 30px rgba(30,131,228,0.22)";
                  }}
                >
                  Agendar conversación estratégica
                </a>
              </div>

              <div
                style={{
                  fontSize: "13px",
                  lineHeight: "1.6",
                  color: "rgba(255,255,255,0.66)",
                }}
              >
                30 minutos · contexto real · integración · siguiente nivel
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}