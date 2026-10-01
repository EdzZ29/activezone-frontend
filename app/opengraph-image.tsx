import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "ActiveZone Butuan Fitness Studio — Train Strong. Feel Strong. Be Active.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const mark = await readFile(join(process.cwd(), "public/brand/az-mark.png"), "base64");
const markSrc = `data:image/png;base64,${mark}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08080a",
          padding: "72px 80px",
          borderLeft: "14px solid #89f53d",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={186} height={120} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 900, color: "white", letterSpacing: -2, lineHeight: 1 }}>
            ACTIVEZONE
          </div>
          <div style={{ fontSize: 30, color: "#a1a1aa", letterSpacing: 10, marginTop: 14 }}>
            BUTUAN FITNESS STUDIO
          </div>
          <div style={{ fontSize: 34, color: "#89f53d", marginTop: 48, fontWeight: 700 }}>
            Train Strong. Feel Strong. Be Active.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
