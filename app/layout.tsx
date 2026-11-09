import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/common/PWARegister";

export const metadata: Metadata = {
  title: "aura",
  description: "Personal focus timer and dark motivation studio",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/aura-logo.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
      { url: "/aura-logo.png", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "aura",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-[#ff4d6d]/30 selection:text-white touch-manipulation">
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
