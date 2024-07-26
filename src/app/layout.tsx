import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "~/styles/globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Calculadora de Derivadas",
  description: "Calculadora de Derivadas y Graficador de Funciones",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${notoSans.variable}`}>
      <body className="flex min-h-screen flex-col bg-gradient-to-r from-slate-50 to-blue-200 px-4 pb-24">
        {children}
      </body>
    </html>
  );
}
