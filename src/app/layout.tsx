import type { Metadata } from "next";
import { Asta_Sans, Geist_Mono } from "next/font/google";

import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";
import { Providers } from "@/components/providers";
import { createDefaultMetadata } from "@/lib/seo";

import "./globals.css";

const astaSans = Asta_Sans({
  variable: "--font-asta-sans",
  subsets: ["latin"],
  weight: "variable",
  adjustFontFallback: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = createDefaultMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${astaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <Analytics />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:outline-none focus:ring-3 focus:ring-ring/50"
          >
            본문으로 건너뛰기
          </a>
          <Navbar />
          <main id="main" className="flex flex-1 flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
