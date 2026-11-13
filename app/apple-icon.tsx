import { ImageResponse } from "next/og";

import { BRAND_DARK, BRAND_LIGHT, LOGO_BARS, LOGO_VIEW_BOX } from "@/lib/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: same mark and colors as `app/icon.svg` (iOS adds the rounding). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_DARK,
        }}
      >
        <svg width="106" height="96" viewBox={LOGO_VIEW_BOX}>
          {LOGO_BARS.map((points) => (
            <polygon key={points} points={points} fill={BRAND_LIGHT} />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
