import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CustomCursor, MouseSpotlight } from "@/components/MouseTracker";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Invio Social - Digital Agency",
  description: "Transform your digital presence with Invio Social's cutting-edge services",
  keywords: "digital marketing, SEO, web development, social media, digital agency",
  openGraph: {
    title: "Invio Social - Digital Agency",
    description: "Transform your digital presence",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CustomCursor />
          <MouseSpotlight />
          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
