import type { Metadata, Viewport } from "next";
import "./globals.css";

// =============================================================================
// Root layout — handles <head> metadata including PWA tags.
// =============================================================================

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://streamfinder-dlnedllmt-duncan-millers-projects-41d43e33.vercel.app/";
const description =
  "Find where your favorite movies and TV shows are streaming. Search once, discover everywhere.";

export const metadata: Metadata = {
  title: "StreamFinder",
  description,
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  // Open Graph metadata for link previews
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "StreamFinder",
    description,
    siteName: "StreamFinder",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "StreamFinder - Find where to stream movies and TV shows",
      },
    ],
  },
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "StreamFinder",
    description,
    images: [`${siteUrl}/og-image.png`],
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
