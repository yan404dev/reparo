import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f3f4f6",
        foreground: "#1f2937",
        brand: {
          50: "#edf8f3",
          100: "#d5f0e3",
          200: "#ade2c9",
          300: "#77cfa9",
          400: "#3db884",
          500: "#00875a",
          600: "#00704a",
          700: "#00593b",
          800: "#00452e",
          900: "#003322",
          DEFAULT: "#00875a",
          hover: "#00704a",
          active: "#00593b",
          soft: "rgba(0, 135, 90, 0.08)",
        },
        slate: {
          navy: "#1c2b33",
          dark: "#141f25",
          body: "#465a69",
          muted: "#606770",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937",
        },
        primary: {
          DEFAULT: "#00875a",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f5f6f7",
          foreground: "#1c2b33",
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
        },
        accent: {
          DEFAULT: "#edf8f3",
          foreground: "#00875a",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        border: "#e5e7eb",
        input: "#dee3e9",
        ring: "#00875a",
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "1.5rem",
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        sans: [
          "var(--font-optimistic)",
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        optimistic: [
          "var(--font-optimistic)",
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
