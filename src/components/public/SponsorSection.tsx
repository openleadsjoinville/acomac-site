"use client";

import SponsorBanner from "./SponsorBanner";

export default function SponsorSection({
  slot,
  background = "light",
}: {
  slot: string;
  background?: "light" | "white" | "transparent";
}) {
  const bg =
    background === "light"
      ? "#f7f8fb"
      : background === "white"
      ? "#fff"
      : "transparent";

  return (
    <section
      className="py-12 md:py-16"
      style={{ background: bg }}
    >
      <div className="max-w-xs mx-auto px-6">
        <SponsorBanner slot={slot} />
      </div>
    </section>
  );
}
