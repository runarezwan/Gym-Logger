import type { Metadata, Viewport } from "next";
import { Geist, Outfit } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { SettingsProvider } from "@/context/settings-context";
import AuthGuard from "@/components/auth-guard";
import ErrorBoundary from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gym Logger • Elite PWA",
  description: "Mobile-first, high-performance strength tracking.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gym Logger"
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f1a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${outfit.variable} antialiased selection:bg-accent/30`}>
        <AuthContextProvider>
           <ThemeProvider>
              <SettingsProvider>
                 <AuthGuard>
                    <ErrorBoundary>
                       <div className="mx-auto max-w-lg min-h-screen relative overflow-x-hidden">
                          {children}
                       </div>
                    </ErrorBoundary>
                 </AuthGuard>
              </SettingsProvider>
           </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
