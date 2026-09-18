import React from "react";
import Link from "next/link";
import { siteContent } from "../constants/site-content";

export const TestimonialsSection = () => {
  return (
    <section className="relative z-[1] bg-white">
      <div
        className="mx-auto max-w-[1248px] px-6 lg:px-8"
        style={{
          paddingTop: 80,
          paddingBottom: 95,
        }}
      >
        <div className="max-w-2xl">
          <p
            style={{
              fontSize: 14,
              letterSpacing: ".25px",
              lineHeight: "20px",
              color: "#465A69",
              margin: "0 .1em .6em",
              fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
              fontWeight: 400,
            }}
          >
            Depoimento de Bancada
          </p>

          <h2
            style={{
              fontSize: 32,
              letterSpacing: ".5px",
              lineHeight: "38px",
              color: "#1c2b33",
              fontWeight: 500,
              fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
              margin: 0,
            }}
          >
            A confiança de quem conta com nossa operação todos os dias.
          </h2>
        </div>

        {/* Clean Editorial Testimonial Quote */}
        <div className="mt-12 max-w-3xl">
          <blockquote
            className="text-[20px] sm:text-[22px] lg:text-[24px] text-[#1c2b33] leading-relaxed"
            style={{
              fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
              fontWeight: 400,
              margin: 0,
            }}
          >
            &ldquo;{siteContent.testimonial.quote}&rdquo;
          </blockquote>

          <div className="mt-8 pt-6 border-t border-[#DEE3E9]">
            <p
              className="text-[17px] font-semibold text-[#1c2b33]"
              style={{
                fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                margin: 0,
              }}
            >
              {siteContent.testimonial.author}
            </p>
            <p
              className="text-[14px] text-[#465A69] mt-0.5"
              style={{
                fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                margin: 0,
              }}
            >
              {siteContent.testimonial.role}
            </p>
          </div>
        </div>

        {/* Integrated Closing CTA Card */}
        <div className="mt-20 rounded-[24px] border border-[#DEE3E9] bg-[#F5F6F7] p-10 sm:p-14 text-center">
          <h3
            style={{
              fontSize: 28,
              letterSpacing: ".5px",
              lineHeight: "34px",
              color: "#1c2b33",
              fontWeight: 500,
              fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
              margin: 0,
            }}
          >
            Pronto para transformar a gestão da sua assistência técnica?
          </h3>

          <p
            className="mt-3 text-[16px] text-[#465A69] max-w-xl mx-auto"
            style={{
              fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
            }}
          >
            Descubra como é ter uma bancada organizada e sem furos no estoque por apenas R$ 49,90 por mês.
          </p>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
            <Link
              href={siteContent.cta.primary.href}
              className="inline-flex items-center justify-center rounded-full bg-[#00875a] px-8 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#00704a] active:scale-[0.98]"
            >
              Usar agora
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-[#dee3e9] bg-white px-7 py-3.5 text-[15px] font-semibold text-[#1c2b33] hover:bg-slate-50 transition-colors"
            >
              Acessar Minha Conta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
