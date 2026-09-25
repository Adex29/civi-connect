import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4, Space_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppPreloader } from "@/components/ui/app-preloader";
import { RoutePreloader } from "@/components/ui/route-preloader";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

const fontMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Civi-Tech | Civic Engagement Simulation Platform",
  description: "A Web-Based Civic Engagement Simulation Platform for Community Problem-Solving in Senior High School Citizenship and Civic Engagement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <RoutePreloader />
            <AppPreloader />
            {children}
            <Toaster richColors position="top-center" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
