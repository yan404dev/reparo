import React from "react";
import { siteContent } from "../constants/site-content";
import { Smartphone, DollarSign, Laptop } from "lucide-react";

const pillarIcons = [Smartphone, DollarSign, Laptop];

export const ServicesGrid = () => {
  return (
    <section id="como-funciona" className="relative z-[1] bg-white">
      <div
        className="mx-auto max-w-[1248px] px-6 lg:px-8"
        style={{ paddingTop: 80, paddingBottom: 95 }}
      >
        {/* Eyebrow and Heading */}
        <div>
          <p
            style={{
              fontSize: 14,
              letterSpacing: ".25px",
              lineHeight: "20px",
              color: "#1c2b33",
              margin: "0 .1em .6em",
              fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
              fontWeight: 400,
            }}
          >
            Pilares da Plataforma
          </p>

          <h2
            style={{
              fontSize: 32,
              letterSpacing: ".5px",
              lineHeight: "38px",
              color: "#1C2B33",
              fontWeight: 500,
              fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
              margin: 0,
            }}
          >
            Estrutura completa para atender cada etapa da sua operação.
          </h2>
        </div>

        {/* 3 Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {siteContent.servicesPillars.map((item, index) => {
            const IconComponent = pillarIcons[index] || Smartphone;
            return (
              <div
                key={item.id}
                className="flex flex-col justify-start rounded-[24px] border border-[#DEE3E9] bg-white p-8 lg:p-10"
                style={{ borderRadius: 24 }}
              >
                {/* Dark circular icon badge */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1c2b33] text-white">
                  <IconComponent className="h-7 w-7 text-white" />
                </div>

                {/* Card Title */}
                <h3
                  className="mt-6 text-[22px] lg:text-[24px]"
                  style={{
                    lineHeight: "30px",
                    letterSpacing: ".25px",
                    fontWeight: 500,
                    color: "#1c2b33",
                    fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                  }}
                >
                  {item.title}
                </h3>

                {/* Card Paragraph */}
                <p
                  className="mt-4 text-[16px]"
                  style={{
                    color: "#465A69",
                    lineHeight: "25px",
                    letterSpacing: ".25px",
                    fontWeight: 400,
                    fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                  }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
