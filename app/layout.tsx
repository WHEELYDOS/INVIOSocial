import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CustomCursor, MouseSpotlight } from "@/components/MouseTracker";
import SmoothScroll from "@/components/SmoothScroll";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Manrope mimics the clean, tight geometric grotesque look of Neue Haas Grotesk closely
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Invio Social - Marketing Agency",
  description: "Transform your business with Invio Social's cutting-edge marketing services",
  keywords: "digital marketing, SEO, web development, social media, marketing agency",
  openGraph: {
    title: "Invio Social - Marketing Agency",
    description: "Transform your business presence",
    type: "website",
  },
  icons: {
    icon: "/images/logo1.png",
    shortcut: "/images/logo1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SmoothScroll>
            <CustomCursor />
            <MouseSpotlight />
            {children}
          </SmoothScroll>
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
