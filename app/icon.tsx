import { ImageResponse } from "next/og";

export const size = {
  width: 48,
  height: 48,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <rect width="48" height="48" rx="11" fill="#E8451A" />
        <path d="M24 8 L30 24 L24 20.5 L18 24 Z" fill="#ffffff" />
        <path d="M24 40 L18 24 L24 27.5 L30 24 Z" fill="#FCC7B5" />
        <circle cx="24" cy="24" r="2.6" fill="#E8451A" stroke="#ffffff" strokeWidth="1.6" />
      </svg>
    ),
    size,
  );
}