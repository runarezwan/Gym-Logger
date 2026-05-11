import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthContextProvider } from "@/context/auth-context";
import { SettingsProvider } from "@/context/settings-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Gym Logger — Elite Performance Tracker",
  description: "Beautiful, fast, and professional gym logger built with Next.js",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthContextProvider>
            <SettingsProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </SettingsProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
