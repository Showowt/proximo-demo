import type { Metadata, Viewport } from "next";
import { Manrope, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = "https://proximo-demo.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0B0B12",
};

export const metadata: Metadata = {
  title: "PRÓXIMO · Hacemos visible a quién deberías conocer",
  description:
    "Entrá a cualquier evento y sabé al instante a quién conocer, por qué, y qué decirle. AI networking para eventos en vivo.",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PRÓXIMO",
  },
  openGraph: {
    title: "PRÓXIMO · Hacemos visible a quién deberías conocer",
    description:
      "Entrá a cualquier evento y sabé al instante a quién conocer, por qué, y qué decirle. AI networking para eventos en vivo.",
    url: SITE_URL,
    siteName: "PRÓXIMO",
    images: [
      {
        url: "/og-card.png",
        width: 1200,
        height: 630,
        alt: "PRÓXIMO — AI Event Networking",
      },
    ],
    locale: "es_SV",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PRÓXIMO · Hacemos visible a quién deberías conocer",
    description:
      "AI networking para eventos en vivo. Sabé a quién conocer, por qué, y qué decirle.",
    images: ["/og-card.png"],
  },
  other: {
    "og:logo": `${SITE_URL}/og-image.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-[#0B0B12]">
        {children}
      </body>
    </html>
  );
}
