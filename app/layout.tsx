import type { Metadata, Viewport } from "next";
import "./globals.css";

// =============================================================================
// Root layout — handles <head> metadata including PWA tags.
// =============================================================================

export const metadata: Metadata = {
  title: "StreamFinder",
  description:
    "Search for movies and TV shows and find out where they're streaming.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  // PWA / iOS-specific meta tags
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "StreamFinder",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f0f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
