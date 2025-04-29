import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "**/*.zip",
      "**/*.png",
      "**/*.jpg",
      "**/*.jpeg",
      "**/*.gif",
      "**/*.ico",
      "**/*.woff",
      "**/*.woff2",
      "**/*.eot",
      "**/*.ttf",
      "**/*.svg",
      "**/*.pdf",
      "**/*.mp4",
      "**/*.webm",
      "**/*.mp3",
      "**/*.wav",
      "**/tsconfig.tsbuildinfo",
      "**/.next/**",
      "**/node_modules/**",
      "**/components/Admin/AdminDashboard.tsx",
    ],
  },
];

export default eslintConfig;
