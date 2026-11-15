import type { Metadata } from "next";
import "./globals.css";
import { ChamberProvider } from "@/context/ChamberContext";

export const metadata: Metadata = {
  title: "LexChron",
  description: "The premier multi-chamber legal practice platform for Senior Advocates, Associate Counsels, Law Firms, and Corporate Litigants. Built for the Indian judicial ecosystem.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('counselbook_theme');
                  var prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefDark) || (saved === 'system' && prefDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full min-h-screen bg-[#f3eee3] dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] font-sans">
        <ChamberProvider>
          {children}
        </ChamberProvider>
      </body>
    </html>
  );
}
