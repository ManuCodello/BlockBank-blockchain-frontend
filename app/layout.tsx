import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Web3Provider } from "./providers"; // Importa el proveedor

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlockBank",
  description: "Decentralized Lending Protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Web3Provider>{children}</Web3Provider> {/* Envuelve tu app */}
      </body>
    </html>
  );
}
