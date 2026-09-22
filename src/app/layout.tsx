import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/AppShell";
import { ThemeSync } from "@/components/ThemeToggle";
import { ServiceWorker } from "@/components/ServiceWorker";
import { STORAGE_KEY } from "@/lib/storage-key";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "IAL Revision", template: "%s · IAL Revision" },
  description: "Private revision site for Pearson Edexcel IAL exams, October/November 2026.",
  robots: { index: false, follow: false },
  applicationName: "IAL Revision",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "IAL Revision", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#131315" },
  ],
};

/**
 * Applies the saved theme before the first paint, so switching pages in
 * dark mode never flashes white.
 */
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)});if(!s)return;var t=JSON.parse(s).theme;if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <ThemeSync />
        <ServiceWorker />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
