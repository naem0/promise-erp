import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProviderWrapper from "../components/next-auth/SessionProviderWrapper";
import { PermissionProvider } from "@/providers/PermissionProvider";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"], // Reduced from all weights
  preload: true,
  adjustFontFallback: true, // Prevent layout shift
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://promise-erp-xi.vercel.app'),
  title: {
    default: 'Promise IT Ltd - Leading IT Solutions & Training',
    template: '%s'
  },
  description: 'Professional IT training, software development, and ERP solutions provider. Learn from industry experts and advance your career.',
  keywords: ['IT training', 'software development', 'ERP solutions', 'web development', 'programming courses'],
  authors: [{ name: 'Promise IT Ltd' }],
  creator: 'Promise IT Ltd',
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
    <html lang="en">
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
          <PermissionProvider>
            {children}
            <Toaster />
          </PermissionProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
