import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 140,
          background: "#09090b", // zinc-950
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "32px",
          border: "4px solid rgba(234, 179, 8, 0.4)",
        }}
      >
        🪙
      </div>
    ),
    {
      ...size,
      emoji: "twemoji",
    },
  );
}
