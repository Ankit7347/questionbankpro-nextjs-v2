// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import { cookies,headers } from "next/headers";
import "./globals.css";

import SessionProvider from "@/components/SessionProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

// ⛔ chartSetup is side-effectful → keep it server-safe
import "@/lib/chartSetup";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Metadata (SERVER-ONLY, correct placement)
export const metadata: Metadata = {
  title: "QR Notes - Questionbankpro",
  description:
    "Questionbankpro provides comprehensive study resources including question banks, chapter-wise quizzes, previous year papers, syllabus outlines, notes, and best books for students from Class 10 to B.Tech.",
  applicationName: "Questionbankpro",
  keywords: [
    "questionbankpro",
    "question bank",
    "previous year papers",
    "syllabus",
    "quiz",
    "study notes",
    "exam preparation",
    "pdf",
    "education",
  ],
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "QR Notes - Questionbankpro",
    description: "Questionbank, notes, books, and previous year papers.",
    url: "https://questionbankpro.com",
    siteName: "Questionbankpro",
    images: [
      {
        url: "https://questionbankpro.com/favicon.ico",
        width: 1200,
        height: 630,
        alt: "QR Notes - Questionbankpro",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ SERVER decides theme
  const cookieStore = await cookies();
  const headerStore = await headers();
  const theme = cookieStore.get("theme")?.value;

  const isDark = theme === "dark"||(theme === "system" && headerStore.get("sec-ch-prefers-color-scheme") === "dark");

  return (
    <html
    lang="en"
    className={`${isDark ? "dark" : ""} ${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
    >
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WK4GSN5F');`,
          }}
        />

        {/* JSON-LD: Website */}
        <Script
          id="jsonld-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Questionbankpro",
              url: "https://www.questionbankpro.com",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://www.questionbankpro.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* JSON-LD: Education Organization */}
        <Script
          id="jsonld-education"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationOrganization",
              name: "Questionbankpro",
              url: "https://www.questionbankpro.com",
              logo: "https://www.questionbankpro.com/favicon.ico",
              description:
                "Questionbankpro provides syllabus, question banks, previous year papers, books, and notes for students and competitive exams.",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "support@questionbankpro.com",
                url: "https://www.questionbankpro.com",
              },
            }),
          }}
        />

        {/* Early theme hydration fix (safe) */}

        {/* <Script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = document.cookie.match(/(?:^|; )theme=([^;]+)/)?.[1];
                  if (!theme) return;

                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else if (theme === 'system') {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (_) {}
              })();
            `,
          }}
        /> */}




      </head>

      <body className="antialiased bg-white dark:bg-gray-900 transition-colors duration-300">
        <SessionProvider>
            {/* GTM noscript */}
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-WK4GSN5F"
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
                />
            </noscript>

            <ThemeProvider>
              <div className="min-h-screen flex flex-col">
                {children}
              </div>
            </ThemeProvider>
            <Toaster />
          <Analytics />
          <SpeedInsights />
        </SessionProvider>
      </body>
    </html>
  );
}
