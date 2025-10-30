import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export const dynamic = "force-static";

const Icon = () =>
  new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563eb, #38bdf8)",
          borderRadius: "16px",
          fontSize: 36,
          color: "white",
          fontWeight: 700,
          letterSpacing: "-2px",
          fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        PC
      </div>
    ),
    size,
  );

export default Icon;
