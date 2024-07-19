import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Derivadas",
  description: "Calculadora de Derivadas y Graficador de Funciones",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${GeistSans.variable}`}>
      <body className="px-4 sm:px-0 flex min-h-screen flex-col bg-slate-200 pb-24">
        {children}
      </body>
    </html>
  );
}

// TODO: beggining graph
// TODO: Validate input
