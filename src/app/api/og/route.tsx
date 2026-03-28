import { ImageResponse } from "next/og";
import { siteDescription, siteName } from "@/config/constant";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || siteName;
    const description = searchParams.get("description") || siteDescription;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#09090b", // slate-950
            position: "relative",
            overflow: "hidden",
            fontFamily: "sans-serif",
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "-10%",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, rgba(234, 179, 8, 0) 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              right: "-5%",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(234, 179, 8, 0.1) 0%, rgba(234, 179, 8, 0) 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "40px",
              padding: "60px 80px",
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Icon container */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(45deg, #18181b, #27272a)",
                borderRadius: "32px",
                width: "160px",
                height: "160px",
                marginBottom: "40px",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5), 0 0 20px rgba(234, 179, 8, 0.2)",
                border: "1px solid rgba(234, 179, 8, 0.2)",
              }}
            >
              <span style={{ fontSize: "100px", lineHeight: 1 }}>🪙</span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "white",
                marginBottom: "20px",
                textAlign: "center",
                letterSpacing: "-0.02em",
                display: "flex",
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: "32px",
                color: "#a1a1aa", // zinc-400
                textAlign: "center",
                maxWidth: "800px",
                lineHeight: 1.5,
                display: "flex",
              }}
            >
              {description}
            </div>
          </div>

          {/* Footer branding */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              fontSize: "24px",
              color: "#52525b", // zinc-600
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>✨ seasonal anime ranking</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        emoji: "twemoji",
      },
    );
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
