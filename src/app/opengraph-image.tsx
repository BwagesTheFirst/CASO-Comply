import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "CASO Comply — AI-Powered Document Accessibility Remediation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0A1628 0%, #0F2440 50%, #0A1628 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-1px",
            }}
          >
            CASO
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#1A8FDE",
              letterSpacing: "-1px",
            }}
          >
            Comply
          </div>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.2,
            marginBottom: "24px",
            maxWidth: "900px",
          }}
        >
          AI-Powered Document Accessibility Remediation
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#8B9BB4",
            lineHeight: 1.5,
            maxWidth: "800px",
          }}
        >
          WCAG 2.1 AA • PDF/UA • Section 508 — Starting at $0.30/page
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              background: "#0F6FBA",
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: "12px",
            }}
          >
            Get a Free Compliance Scan
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            fontSize: "16px",
            color: "#4A5B75",
          }}
        >
          casocomply.com
        </div>
      </div>
    ),
    { ...size }
  );
}
