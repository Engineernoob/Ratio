import type { Metadata } from "next";
import { EB_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { RootLayoutWrapper } from "@/components/RootLayoutWrapper";

const ebGaramond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RATIO",
  description: "Scholarly OS for the modern scholar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${ebGaramond.variable} ${jetBrainsMono.variable} font-mono antialiased`}
        style={{
          background: "var(--background, #0A0A0A)",
        }}
      >
        <ThemeProvider>
          <RootLayoutWrapper>{children}</RootLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
