"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteContent } from "../constants/site-content";


export const SolutionsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="recursos" className="relative z-[1] bg-white">
      <div
        className="mx-auto max-w-[1248px] px-6 lg:px-8"
        style={{
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        {/* Section Heading Container with generous breathing room */}
        <div style={{ paddingBottom: 80 }}>
          <p
            style={{
              fontSize: 14,
              letterSpacing: ".25px",
              lineHeight: "20px",
              color: "#465A69",
              margin: "0 0 10px",
              fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
              fontWeight: 500,
            }}
          >
            Funcionalidades de Alta Performance
          </p>
          <h2
            style={{
              fontSize: 32,
              letterSpacing: ".5px",
              lineHeight: "38px",
              color: "#1c2b33",
              marginBottom: 0,
              textAlign: "left",
              fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
              fontWeight: 500,
            }}
          >
            Controle cirúrgico para cada etapa da bancada: da recepção ao lucro no bolso.
          </h2>
        </div>

        {/* 2-Column Layout with generous horizontal gap */}
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-20">
          {/* Left Column: Interactive Visual Showcase Container (540x675 - 125% aspect ratio) */}
          <div className="flex w-full flex-col items-center justify-center lg:w-1/2 lg:self-center">
            <div
              className="relative mx-auto w-full max-w-[540px] overflow-hidden rounded-[24px] border border-[#DEE3E9] bg-[#F5F6F7] shadow-sm"
              style={{ borderRadius: 24, zIndex: 0 }}
            >
              {/* 125% aspect-ratio container */}
              <div
                className="relative w-full"
                style={{ paddingBottom: "125.00%", borderRadius: 24 }}
              >
                {siteContent.solutions.map((item, index) => {
                  const solutionImages = [
                    "/images/feature-checklist.jpg",
                    "/images/feature-markup.jpg",
                    "/images/feature-inventory.jpg",
                    "/images/feature-quote.jpg",
                  ];
                  const imgSrc = solutionImages[index] || "/images/feature-checklist.jpg";

                  return (
                    <div
                      key={item.id}
                      className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ease-in-out ${
                        activeIndex === index
                          ? "opacity-100 z-10"
                          : "opacity-0 z-0 pointer-events-none"
                      }`}
                      style={{ borderRadius: 24 }}
                    >
                      <img
                        src={imgSrc}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Accordion List */}
          <div className="flex w-full flex-col justify-center lg:w-1/2 lg:self-center lg:pl-8">
            {siteContent.solutions.map((item, index) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className="group cursor-pointer flex flex-col justify-center border-b border-[#DEE3E9] py-7 lg:py-8 transition-colors"
                >
                  {/* Tag */}
                  <span
                    className="text-[11px] font-bold tracking-wider uppercase mb-1.5 transition-colors"
                    style={{ color: isActive ? "#00875a" : "#8D949E" }}
                  >
                    {item.tag}
                  </span>

                  {/* Heading */}
                  <h3
                    className="transition-colors duration-300 ease-in-out"
                    style={{
                      fontSize: "clamp(20px, 1.8vw, 24px)",
                      letterSpacing: ".3px",
                      lineHeight: "32px",
                      fontWeight: 500,
                      color: isActive ? "#1c2b33" : "rgb(70, 90, 105)",
                      margin: 0,
                      fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Accordion Collapse Animation */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-400 ease-in-out ${
                      isActive
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div style={{ paddingTop: 14 }}>
                        <p
                          style={{
                            color: "rgb(70, 90, 105)",
                            fontSize: 17,
                            letterSpacing: ".25px",
                            lineHeight: "26px",
                            fontWeight: 400,
                            margin: "0 0 16px",
                            fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                          }}
                        >
                          {item.description}
                        </p>

                        <div>
                          <Link
                            href={item.linkHref}
                            className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-75"
                            style={{
                              color: "#00875a",
                              textDecorationColor: "#ade2c9",
                              textDecorationLine: "underline",
                              textUnderlinePosition: "under",
                              fontSize: "14px",
                              letterSpacing: ".25px",
                              lineHeight: "20px",
                              fontWeight: 500,
                              fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                            }}
                          >
                            {item.linkText} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
