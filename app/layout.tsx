import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/common/PWARegister";

export const metadata: Metadata = {
  title: "aura",
  description: "Personal focus timer and dark motivation studio",
  manifest: "/manifest.json",
  icons: {
    icon: "/aura-logo.png",
    apple: "/aura-logo.png",
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-[#ff4d6d]/30 selection:text-white">
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
