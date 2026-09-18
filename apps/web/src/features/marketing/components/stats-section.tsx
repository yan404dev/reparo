import React from "react";
import { siteContent } from "../constants/site-content";

export const StatsSection = () => {
  return (
    <section
      id="resultados"
      className="relative z-[1]"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Heading + Paragraph container */}
      <div
        className="mx-auto max-w-[1248px] px-6 lg:px-8"
        style={{
          paddingTop: 95,
          paddingBottom: 32,
        }}
      >
        <h2
          style={{
            fontSize: 32,
            letterSpacing: ".5px",
            lineHeight: "38px",
            color: "#1c2b33",
            fontWeight: 500,
            fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
            margin: 0,
            marginBottom: ".5em",
          }}
        >
          Resultados que sustentam a operação de quem não pode parar.
        </h2>

        <p
          style={{
            color: "rgb(70, 90, 105)",
            fontSize: 18,
            letterSpacing: ".25px",
            lineHeight: "27px",
            fontWeight: 400,
            margin: "1em 0",
            fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
          }}
        >
          O Reparô opera com processos replicáveis, auditáveis e orientados por dados — do checklist de entrada à entrega ao cliente — para que sua assistência técnica tenha previsibilidade, zero furos e lucro garantido.
        </p>
      </div>

      {/* Single card with 3 stats */}
      <div
        className="mx-auto max-w-[1232px] px-3 lg:px-0"
        style={{
          paddingBottom: 95,
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-3 rounded-[24px] border border-[#DEE3E9]"
          style={{
            borderRadius: 24,
            backgroundColor: "#F5F6F7",
            padding: "60px 4.154%",
          }}
        >
          {siteContent.stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col justify-start p-6 lg:p-8"
            >
              {/* Big Number */}
              <p
                style={{
                  fontSize: 48,
                  letterSpacing: "-0.5px",
                  lineHeight: "56px",
                  fontWeight: 700,
                  color: "#1c2b33",
                  margin: "0 0 12px",
                  fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                }}
              >
                {stat.value}
              </p>

              {/* Stat Description */}
              <p
                style={{
                  color: "rgb(70, 90, 105)",
                  fontSize: 16,
                  letterSpacing: ".25px",
                  lineHeight: "25px",
                  fontWeight: 400,
                  margin: 0,
                  fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                }}
              >
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
