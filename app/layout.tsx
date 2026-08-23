import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import SessionProviderWrapper from "../components/next-auth/SessionProviderWrapper";
import { PermissionProvider } from "@/providers/PermissionProvider";
import { Toaster } from "@/components/ui/sonner";
import PwaRegister from "@/components/common/PwaRegister";

import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
// import SessionWatcher from "@/components/auth/SessionWatcher";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"], // Reduced from all weights
  preload: true,
  adjustFontFallback: true, // Prevent layout shift
});

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://beta.e-laeltd.com'),
  title: {
    default: 'Promise IT Ltd - Leading IT Solutions & Training',
    template: '%s'
  },
  description: 'Professional IT training, software development, and ERP solutions provider. Learn from industry experts and advance your career.',
  keywords: ['IT training', 'software development', 'ERP solutions', 'web development', 'programming courses'],
  authors: [{ name: 'Promise IT Ltd' }],
  creator: 'Promise IT Ltd',
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/pwa-icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Promise IT Ltd",
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Promise IT Ltd',
    title: 'Promise IT Ltd - Leading IT Solutions & Training',
    description: 'Professional IT training and enterprise solutions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Promise IT Ltd - Leading IT Solutions & Training',
    description: 'Professional IT training and enterprise solutions',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: 'your-google-site-verification',
    // yandex: 'your-yandex-verification',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <SessionProviderWrapper>
          <PwaRegister />
          {/* <SessionWatcher /> */}
          <PermissionProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </PermissionProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
