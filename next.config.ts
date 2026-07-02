import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pdf-parse",
    "@react-pdf/renderer",
    "mammoth",
    "xlsx",
    "exceljs",
    "googleapis",
  ],
};

export default nextConfig;
