import type { Metadata } from "next";
import "./globals.css";
import { ChamberProvider } from "@/context/ChamberContext";

export const metadata: Metadata = {
  title: "CounselBook | Sovereign Legal Practice & Chamber Operating System",
  description: "The premier multi-chamber legal practice platform for Senior Advocates, Associate Counsels, Law Firms, and Corporate Litigants. Built for the Indian judicial ecosystem.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%231e3a8a'/%3E%3Ctext x='50' y='68' font-size='52' text-anchor='middle' fill='%23ffffff' font-family='Georgia'%3EC%3C/text%3E%3C/svg%3E",
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
      <body className="h-full min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-[#f8fafc] font-sans transition-colors duration-200">
        <ChamberProvider>
          {children}
        </ChamberProvider>
      </body>
    </html>
  );
}
