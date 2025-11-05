import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spa Madangel - Sistema de Gestión",
  description: "Sistema de gestión integral para Spa Madangel. Administra citas, clientes, empleados y servicios de uñas y belleza.",
  keywords: ["Spa Madangel", "gestión de spa", "citas de belleza", "manicura", "pedicura", "uñas", "Colombia", "Rionegro"],
  authors: [{ name: "Spa Madangel" }],
  openGraph: {
    title: "Spa Madangel - Sistema de Gestión",
    description: "Sistema de gestión para spa de uñas y belleza",
    siteName: "Spa Madangel",
    type: "website",
    locale: "es_CO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spa Madangel",
    description: "Sistema de gestión para spa de uñas y belleza",
  },
  robots: {
    index: false,  // Sistema privado, no indexar
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
