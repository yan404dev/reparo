import React from "react";
import { siteContent } from "../constants/site-content";
import { XCircle, CheckCircle2 } from "lucide-react";

export const ComparisonSection = () => {
  return (
    <section id="comparativo" className="relative z-[1] bg-[#F5F6F7]">
      <div
        className="mx-auto max-w-[1248px] px-6 lg:px-8"
        style={{ paddingTop: 90, paddingBottom: 95 }}
      >
        {/* Header */}
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
            Prova de Valor
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
            {siteContent.comparison.heading}
          </h2>

          <p
            className="mt-3 text-[17px] text-[#465a69]"
            style={{ fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif" }}
          >
            {siteContent.comparison.subheading}
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="mt-10 overflow-hidden rounded-[24px] border border-[#DEE3E9] bg-white shadow-sm">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#DEE3E9] bg-[#FAFAFB] text-xs font-bold uppercase tracking-wider text-[#606770]">
            <div className="p-4 md:col-span-4 md:p-6">Rotina da Oficina</div>
            <div className="border-t border-[#DEE3E9] p-4 md:border-t-0 md:border-l md:col-span-4 md:p-6 text-rose-800">
              Antes do Reparô (Improviso)
            </div>
            <div className="border-t border-[#DEE3E9] p-4 md:border-t-0 md:border-l md:col-span-4 md:p-6 text-[#00704a] bg-emerald-50/50">
              Com o Reparô (Gestão Profissional)
            </div>
          </div>

          {/* Rows */}
          {siteContent.comparison.items.map((item, index) => (
            <div
              key={item.aspect}
              className={`grid grid-cols-1 md:grid-cols-12 border-b border-[#DEE3E9] last:border-b-0 text-[15px] transition-colors hover:bg-slate-50/60 ${
                index % 2 === 0 ? "bg-white" : "bg-[#FDFDFD]"
              }`}
            >
              {/* Aspect */}
              <div className="p-4 md:col-span-4 md:p-6 font-semibold text-[#1c2b33] flex items-center">
                {item.aspect}
              </div>

              {/* Before */}
              <div className="border-t border-[#DEE3E9] p-4 md:border-t-0 md:border-l md:col-span-4 md:p-6 text-[#606770] flex items-start gap-2.5">
                <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <span>{item.before}</span>
              </div>

              {/* After */}
              <div className="border-t border-[#DEE3E9] p-4 md:border-t-0 md:border-l md:col-span-4 md:p-6 text-[#1c2b33] font-medium flex items-start gap-2.5 bg-emerald-50/20">
                <CheckCircle2 className="h-5 w-5 text-[#00875a] shrink-0 mt-0.5" />
                <span>{item.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
