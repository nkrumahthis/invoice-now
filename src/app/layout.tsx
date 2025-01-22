import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invoice now",
  description: "Make a quick invoice now",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col items-center justify-items-center min-h-screen p-2 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <header className="text-lg font-bold">
            <h1>Invoice Now</h1>
          </header>
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
            {children}
          </main>

          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://github.com/nkrumahthis/invoice-now"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://nkrumahsarpong.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              author: nkrumahsarpong
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
