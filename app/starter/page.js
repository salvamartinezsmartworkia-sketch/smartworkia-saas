"use client";

import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function StarterPage() {
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
                SMARTWORKIA · STARTER
              </span>

              <h1
                style={{
                  fontSize: "56px",
                  lineHeight: "1.05",
                  fontWeight: "800",
                  letterSpacing: "-0.04em",
                  color: "#162C4B",
                  margin: "0 0 22px",
                  maxWidth: "780px",
                }}
              >
                Empieza a ver lo que hoy
                <span style={{ color: "#1E83E4" }}> no estás viendo</span>
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
                Starter está pensado para entrar sin fricción: un primer paso
                claro para detectar tensiones, señales y oportunidades antes de
                que se conviertan en coste, desorden o decisiones tardías.
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
                  "Piloto / assessment",
                  "Bajo riesgo",
                  "Quick wins",
                  "Valor visible",
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
                  maxWidth: "760px",
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
                    Para qué sirve
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.65",
                      color: "#5d6980",
                    }}
                  >
                    Para poner luz donde hoy hay ruido: caja, margen, señales
                    operativas, tensiones de supply o puntos ciegos de decisión.
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
                    Porque no necesitas comprar una transformación completa para
                    descubrir rápido dónde se está perdiendo valor.
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
                  QUÉ PASA EN STARTER
                </div>

                <div
                  style={{
                    fontSize: "32px",
                    lineHeight: "1.1",
                    fontWeight: "800",
                    marginBottom: "14px",
                  }}
                >
                  Una entrada simple para obtener claridad rápida
                </div>

                <div
                  style={{
                    fontSize: "17px",
                    lineHeight: "1.6",
                    color: "rgba(255,255,255,0.82)",
                    marginBottom: "30px",
                  }}
                >
                  No es un paquete infinito ni una consultoría abstracta. Es una
                  forma ordenada de descubrir rápido qué te está costando dinero,
                  foco o capacidad de reacción.
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
                      Detectamos
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
                      Leemos
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
                      Priorizamos
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
                maxWidth: "940px",
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
                VISIBILIDAD REAL
              </span>

              <h2
                style={{
                  fontSize: "38px",
                  lineHeight: "1.12",
                  fontWeight: "800",
                  letterSpacing: "-0.03em",
                  color: "#162C4B",
                  margin: "0 0 14px",
                  maxWidth: "920px",
                }}
              >
                Esto no va de promesas. Va de empezar a ver mejor.
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
                Starter te da una primera capa de lectura visual y ejecutiva:
                tensiones, señales, anomalías y focos de actuación que hoy suelen
                estar dispersos o enterrados entre ruido operativo.
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
                      MOCKUP · DASHBOARD STARTER
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        lineHeight: "1.1",
                        fontWeight: "800",
                        color: "#162C4B",
                      }}
                    >
                      Lectura rápida de tensiones y focos
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "999px",
                      background: "#eef6ff",
                      border: "1px solid #d9eafb",
                      color: "#1E83E4",
                      fontSize: "13px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Vista ejecutiva
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "14px",
                    marginBottom: "16px",
                  }}
                >
                  {[
                    ["Margen recuperable", "€42K"],
                    ["Alertas activas", "9"],
                    ["Índice de foco", "78"],
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
                          fontSize: "32px",
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
                    Evolución estimada del impacto visible
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "10px",
                      height: "160px",
                    }}
                  >
                    {[38, 56, 74, 86, 112, 128].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: `${h}px`,
                          borderRadius: "14px 14px 10px 10px",
                          background:
                            "linear-gradient(180deg, rgba(84,135,228,0.95) 0%, #243a63 100%)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
                        }}
                      />
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
                      Prioridades detectadas
                    </div>
                    {[
                      "Control financiero",
                      "Operaciones internas",
                      "Supply chain",
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
                            background: i !== 1 ? "#eef6ff" : "#f3f6fb",
                            color: i !== 1 ? "#1E83E4" : "#5d6980",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {i !== 1 ? "Prioridad alta" : "Prioridad media"}
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
                      Diagnóstico inicial
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.75",
                        color: "#5d6980",
                      }}
                    >
                      Evaluación preliminar orientada a eficiencia operativa,
                      control financiero y capacidad de reacción. Esta lectura
                      funciona como primera capa de decisión.
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
                    MOCKUP · ALERTAS
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
                    Señales que antes pasaban desapercibidas
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    {[
                      ["Margen bajo presión", "#fef3c7", "#9a6700"],
                      ["Desfase de caja detectado", "#dbeafe", "#1d4ed8"],
                      ["Riesgo proveedor creciente", "#e7f8ef", "#1f8f63"],
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
                    MOCKUP · WORKFLOW
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      lineHeight: "1.15",
                      fontWeight: "800",
                      marginBottom: "14px",
                    }}
                  >
                    Flujo simple para convertir señal en acción
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    {[
                      "1. Detectar anomalía",
                      "2. Leer impacto potencial",
                      "3. Priorizar siguiente paso",
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
                    No hace falta una infraestructura enorme para obtener una
                    primera capa de claridad útil.
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
                maxWidth: "940px",
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
                LO QUE OBTIENES
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
                Una primera capa de claridad que ya puede mover decisiones
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
                Starter está pensado para generar una lectura útil y visible en
                poco tiempo, sin exigir una gran inversión inicial ni una
                transformación completa desde el día uno.
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
                  title: "Detección temprana",
                  text: "Descubres tensiones que hoy no están siendo visibles con suficiente claridad.",
                },
                {
                  title: "Quick wins",
                  text: "Obtienes oportunidades rápidas de mejora o focos claros de corrección.",
                },
                {
                  title: "Lectura ejecutiva",
                  text: "Conviertes datos dispersos en una conversación mucho más útil para decidir.",
                },
                {
                  title: "Siguiente paso claro",
                  text: "Terminas sabiendo si debes parar ahí, seguir con Pro o escalar a otra capa.",
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
                Reserva una llamada breve de 15 minutos y vemos si Starter encaja contigo
              </h3>

              <p
                style={{
                  fontSize: "17px",
                  lineHeight: "1.65",
                  color: "rgba(255,255,255,0.82)",
                  margin: "0 0 26px",
                  maxWidth: "760px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                En esa llamada no vamos a perder el tiempo. Revisamos rápidamente
                tu caso, detectamos si esta vía tiene sentido para ti y te
                orientamos sobre el siguiente paso más lógico.
              </p>

              <div
                style={{
                  maxWidth: "520px",
                  margin: "0 auto 18px",
                  textAlign: "center",
                }}
              >
                <a
                  href="https://www.smartworkia.com/reserva-starter"
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
                  Reservar llamada de encaje
                </a>
              </div>

              <div
                style={{
                  fontSize: "13px",
                  lineHeight: "1.6",
                  color: "rgba(255,255,255,0.66)",
                }}
              >
                15 minutos · sin compromiso · orientado a valor real
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}