"use client";

import React, { useState } from "react";
import { siteContent } from "../constants/site-content";
import { ChevronDown } from "lucide-react";

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative z-[1] bg-white">
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
            Dúvidas Frequentes
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
            Perguntas frequentes sobre o Reparô.
          </h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-12 divide-y divide-[#DEE3E9] border-y border-[#DEE3E9]">
          {siteContent.faq.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={item.question} className="py-6">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between text-left gap-4 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[18px] sm:text-[20px] font-semibold text-[#1c2b33] group-hover:text-[#00875a] transition-colors"
                    style={{
                      fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                    }}
                  >
                    {item.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DEE3E9] text-[#606770] transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#F5F6F7] text-[#1c2b33]" : "bg-white"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className="pt-4 text-[16px] text-[#465A69] leading-relaxed"
                      style={{
                        fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
