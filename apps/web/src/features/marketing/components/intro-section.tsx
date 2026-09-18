"use client";

import React, { useState } from "react";
import { siteContent } from "../constants/site-content";

export const IntroSection = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="relative z-[1] bg-white">
      <div
        className="mx-auto max-w-[1248px] px-6 lg:px-8"
        style={{ paddingTop: 120, paddingBottom: 60 }}
      >
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left: Heading */}
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
            {siteContent.intro.heading}
          </h2>

          {/* Right: Paragraph + Expandable button */}
          <div>
            <p
              className={expanded ? "" : "line-clamp-3"}
              style={{
                color: "rgb(70, 90, 105)",
                fontSize: 18,
                letterSpacing: ".25px",
                lineHeight: "27px",
                fontWeight: 400,
                margin: "0 0 18px",
                fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif",
              }}
            >
              {siteContent.intro.paragraph}
            </p>

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="cursor-pointer transition-opacity duration-150 hover:opacity-75"
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
                background: "transparent",
                border: "none",
                padding: 0,
              }}
            >
              {expanded ? "Mostrar menos" : "Continuar lendo"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
