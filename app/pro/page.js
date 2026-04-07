"use client";

import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function ProPage() {
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
                SMARTWORKIA · PRO
              </span>

              <h1
                style={{
                  fontSize: "56px",
                  lineHeight: "1.05",
                  fontWeight: "800",
                  letterSpacing: "-0.04em",
                  color: "#162C4B",
                  margin: "0 0 22px",
                  maxWidth: "820px",
                }}
              >
                La capa de decisión que entra cuando tu negocio ya no puede
                <span style={{ color: "#1E83E4" }}> permitirse improvisar</span>
              </h1>

              <p
                style={{
                  fontSize: "20px",
                  lineHeight: "1.65",
                  color: "#4f5d73",
                  margin: "0 0 32px",
                  maxWidth: "720px",
                }}
              >
                Pro está pensado para empresas que ya no necesitan solo
                visibilidad, sino criterio real para priorizar, comparar
                escenarios y decidir antes de que el margen, la caja o la
                operación empiecen a sufrir de verdad.
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
                  "Simulación",
                  "Priorización",
                  "Escenarios",
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
                    Qué resuelve aquí
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.65",
                      color: "#5d6980",
                    }}
                  >
                    Te ayuda a dejar de reaccionar tarde: ordenar tensiones,
                    cruzar áreas, comparar impactos y decidir con una lectura más
                    limpia y más rápida.
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
                    Porque cuando ya hay presión real en caja, margen u
                    operación, mirar dashboards no basta. Necesitas una capa que
                    te ayude a decidir mejor.
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
                  QUÉ PASA EN PRO
                </div>

                <div
                  style={{
                    fontSize: "32px",
                    lineHeight: "1.1",
                    fontWeight: "800",
                    marginBottom: "14px",
                  }}
                >
                  Aquí SmartWorkIA deja de ser interesante y empieza a ser útil
                  de verdad
                </div>

                <div
                  style={{
                    fontSize: "17px",
                    lineHeight: "1.6",
                    color: "rgba(255,255,255,0.82)",
                    marginBottom: "30px",
                  }}
                >
                  Pro no está diseñado para impresionar con pantallas bonitas.
                  Está diseñado para ayudarte a priorizar mejor, detectar antes y
                  reducir el coste de decidir tarde.
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
                      Compara
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
                      Prioriza
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
                      Decide
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
                CAPA DE DECISIÓN
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
                Donde otros muestran datos, aquí empiezas a priorizar decisiones
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
                Pro traduce presión financiera, fricción operativa y señales
                dispersas en una lectura ejecutiva más útil: qué está pasando,
                qué pesa más y dónde actuar primero.
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
                      MOCKUP · CENTRO DE DECISIÓN PRO
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        lineHeight: "1.1",
                        fontWeight: "800",
                        color: "#162C4B",
                      }}
                    >
                      Escenarios, foco y lectura transversal
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
                    Visión Pro
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
                    ["Acciones críticas", "12"],
                    ["ROI potencial", "€118K"],
                    ["Riesgo agregado", "64"],
                    ["Tiempo ahorrado", "-18%"],
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
                    Escenarios comparados
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "12px",
                      height: "170px",
                    }}
                  >
                    {[
                      ["Base", 92],
                      ["Optimizado", 132],
                      ["Tensión", 68],
                      ["Acción priorizada", 148],
                    ].map(([label, h], i) => (
                      <div
                        key={label}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: "10px",
                          height: "100%",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: `${h}px`,
                            borderRadius: "14px 14px 10px 10px",
                            background:
                              i === 2
                                ? "linear-gradient(180deg, rgba(239,68,68,0.88) 0%, #7f1d1d 100%)"
                                : i === 1 || i === 3
                                ? "linear-gradient(180deg, rgba(30,131,228,0.95) 0%, #243a63 100%)"
                                : "linear-gradient(180deg, rgba(148,163,184,0.95) 0%, #475569 100%)",
                          }}
                        />
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#5d6980",
                          }}
                        >
                          {label}
                        </div>
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
                      Focos priorizados
                    </div>
                    {[
                      "Caja y circulante",
                      "Coste operativo",
                      "Supply y cumplimiento",
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
                            background:
                              i === 0
                                ? "#fee2e2"
                                : i === 1
                                ? "#eef6ff"
                                : "#edf9f3",
                            color:
                              i === 0
                                ? "#b91c1c"
                                : i === 1
                                ? "#1E83E4"
                                : "#1f8f63",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {i === 0
                            ? "Urgente"
                            : i === 1
                            ? "Alta"
                            : "Relevante"}
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
                      Lectura ejecutiva
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.75",
                        color: "#5d6980",
                      }}
                    >
                      El modelo cruza tensión financiera, fricción operativa y
                      exposición transversal para ayudarte a leer mejor dónde se
                      acumula el daño y qué acción genera más retorno.
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
                    MOCKUP · ALERTAS CRÍTICAS
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
                    Lo que no puedes seguir detectando tarde
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    {[
                      ["Invoicing lag fuera de rango", "#fee2e2", "#b91c1c"],
                      ["Escenario de margen bajo presión", "#dbeafe", "#1d4ed8"],
                      ["Dependencia operativa creciente", "#e7f8ef", "#1f8f63"],
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
                    MOCKUP · FLUJO DE DECISIÓN
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      lineHeight: "1.15",
                      fontWeight: "800",
                      marginBottom: "14px",
                    }}
                  >
                    De señal dispersa a acción priorizada
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    {[
                      "1. Comparar escenarios",
                      "2. Medir impacto por foco",
                      "3. Activar prioridad ejecutiva",
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
                    Cuando el negocio ya no puede permitirse improvisar, esta
                    capa convierte lectura en foco y foco en decisión.
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
                Una capa seria de trabajo para negocios que necesitan criterio,
                no solo visualización
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
                Pro no se queda en enseñar lo que pasa. Ayuda a ordenar mejor la
                presión, priorizar focos y mover decisiones con más impacto.
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
                  title: "Escenarios comparables",
                  text: "Puedes contrastar alternativas y entender mejor el impacto de actuar, no actuar o hacerlo demasiado tarde.",
                },
                {
                  title: "Priorización real",
                  text: "Dejas de tratar todos los problemas igual y empiezas a ver qué foco genera más daño o más retorno.",
                },
                {
                  title: "Lectura transversal",
                  text: "Cruzas finanzas, operaciones y supply para entender mejor el efecto real de cada tensión.",
                },
                {
                  title: "Velocidad de decisión",
                  text: "Reducir el coste de decidir tarde también es ROI, y aquí empieza a hacerse visible.",
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
                Reserva una sesión de exploración y vemos si Pro es tu siguiente nivel lógico
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
                En esta conversación revisamos tu situación, el tipo de tensión
                que estás soportando y si tiene sentido trabajar con una capa más
                seria de decisión, priorización y escenarios.
              </p>

              <div
                style={{
                  maxWidth: "520px",
                  margin: "0 auto 18px",
                  textAlign: "center",
                }}
              >
                <a
                  href="https://www.smartworkia.com/reserva-pro"
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
                  Reservar sesión de exploración
                </a>
              </div>

              <div
                style={{
                  fontSize: "13px",
                  lineHeight: "1.6",
                  color: "rgba(255,255,255,0.66)",
                }}
              >
                20 minutos · enfoque ejecutivo · orientado a retorno
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}