import React from "react";
import Link from "next/link";
import { siteContent } from "../constants/site-content";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative z-[2] bg-[#1c2b33] text-white overflow-hidden lg:overflow-visible"
      style={{ minHeight: 530 }}
    >
      {/* Background subtle radial aura */}
      <div className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-[#00875a]/15 blur-3xl" />

      {/* Content Container */}
      <div className="relative z-[1] mx-auto h-full max-w-[1248px] px-6 py-14 lg:h-[530px] lg:px-8 lg:py-0">
        <div className="grid h-full grid-cols-1 items-center lg:grid-cols-2 lg:gap-12">
          {/* Left: Headline & Copy */}
          <div className="max-w-[500px] flex flex-col justify-center">
            {/* Headline */}
            <h1
              id="hero-heading"
              style={{
                fontSize: "clamp(28px, 3vw, 36px)",
                letterSpacing: ".5px",
                lineHeight: "1.18",
                color: "#ffffff",
                fontWeight: 600,
                fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                margin: "0 0 16px",
              }}
            >
              {siteContent.hero.headline}
            </h1>

            {/* Sub-headline */}
            <p
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "17px",
                letterSpacing: ".25px",
                lineHeight: "26px",
                fontWeight: 400,
                margin: "0 0 28px",
                fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
              }}
            >
              {siteContent.hero.subheadline}
            </p>

            {/* Single CTA */}
            <div className="flex items-center">
              <Link
                href={siteContent.cta.primary.href}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00875a] px-8 py-3.5 text-[15px] font-semibold text-white shadow-md transition-all duration-150 hover:bg-[#00704a] active:scale-[0.98]"
              >
                <span>{siteContent.cta.primary.label}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Spacer for Desktop Grid */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Desktop Image Overlay — Extends below hero section */}
      <div
        className="pointer-events-none absolute inset-x-0 hidden lg:block"
        style={{ top: "calc(50% - 170px)", bottom: -76 }}
      >
        <div className="pointer-events-auto mx-auto h-full max-w-[1248px] px-6 lg:px-8">
          <div className="ml-[50%] h-full pl-6">
            <div className="relative h-full w-full max-w-[540px] overflow-hidden rounded-[24px] border border-[#304452] bg-[#162229] shadow-2xl">
              <img
                src="/images/hero-bench.jpg"
                alt="Bancada profissional de reparo de smartphones"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile inline preview */}
      <div className="px-6 pb-12 lg:hidden">
        <div className="mx-auto max-w-[480px] overflow-hidden rounded-[20px] border border-[#304452] bg-[#162229] shadow-xl relative aspect-[16/10]">
          <img
            src="/images/hero-bench.jpg"
            alt="Bancada profissional de reparo de smartphones"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};
