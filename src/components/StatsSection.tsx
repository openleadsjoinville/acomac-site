"use client";

import { useInView, useCountUp, staggerStyle } from "@/hooks/useAnimations";

const stats = [
  { value: "350", label: "Empresas associadas" },
  { value: "40+", label: "Anos de história" },
  { value: "40+", label: "Cursos por ano" },
  { value: "40+", label: "Benefícios exclusivos" },
  { value: "8", label: "Municípios atendidos" },
  { value: "1.500m²", label: "De infraestrutura" },
];

function parseNumericValue(value: string): { number: number; suffix: string } {
  const match = value.match(/^([\d.]+)(.*)/);
  if (!match) return { number: 0, suffix: value };
  const raw = match[1].replace(/\./g, "");
  return { number: parseInt(raw, 10), suffix: match[2] };
}

function formatNumber(n: number, original: string): string {
  // Preserve the 1.000 format for "1.000m²"
  if (original.includes(".") && original.includes("m²")) {
    return n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, "0")}` : String(n);
  }
  return String(n);
}

function StatItem({ value, label, index, inView }: { value: string; label: string; index: number; inView: boolean }) {
  const { number, suffix } = parseNumericValue(value);
  const count = useCountUp(number, 2000, inView);
  const display = `${formatNumber(count, value)}${suffix}`;

  return (
    <div
      className="relative flex flex-col items-center justify-center text-center px-5 py-8 group"
      style={staggerStyle(inView, index, 0.1)}
    >
      {/* Top accent line */}
      <span
        className="absolute top-0 left-1/2 h-[2px] -translate-x-1/2"
        style={{
          width: inView ? 40 : 0,
          backgroundColor: "#F6811E",
          transition: `width 0.6s cubic-bezier(0.16,1,0.3,1) ${0.2 + index * 0.08}s`,
        }}
      />

      <span
        className="text-4xl md:text-[2.75rem] font-bold leading-none mb-2 tabular-nums transition-transform duration-300 group-hover:scale-110"
        style={{ color: "#0059AB" }}
      >
        {display}
      </span>
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.14em] leading-snug"
        style={{ color: "#555555" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function StatsSection() {
  const { ref, inView } = useInView(0.2);

  return (
    <section
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f7f7f7 100%)",
        borderTop: "1px solid #e5e5e5",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 divide-x divide-[#e5e5e5]">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
