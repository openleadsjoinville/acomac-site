import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ACOMAC Joinville — Associação dos Comerciantes de Material de Construção";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #002952 0%, #0059AB 55%, #0068c7 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 56,
              height: 4,
              background: "#F6811E",
              borderRadius: 2,
            }}
          />
          ACOMAC Joinville · desde 1983
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            A força do varejo da construção em SC
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.3,
              color: "rgba(255,255,255,0.78)",
              maxWidth: 900,
            }}
          >
            Capacitação, eventos, convênios e representatividade para lojistas
            de material de construção em Santa Catarina.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <div style={{ display: "flex", gap: 32 }}>
            <span>acomacjoinville.com.br</span>
            <span style={{ color: "#F6811E" }}>·</span>
            <span>+55 47 3435-0660</span>
          </div>
          <div
            style={{
              display: "flex",
              padding: "12px 24px",
              borderRadius: 999,
              background: "#F6811E",
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Associe-se
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
