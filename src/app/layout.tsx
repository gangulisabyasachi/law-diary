import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CounselBook — Modern Case Diary & Chamber System",
  description: "Next.js & MongoDB powered legal chamber diary: cases, cause lists, court orders, approvals, and client transparency.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%230c1726'/%3E%3Ctext x='50' y='68' font-size='52' text-anchor='middle' fill='%23e5c572' font-family='Georgia'%3EC%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}

