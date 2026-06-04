import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "PRÓXIMO · Hacemos visible a quién deberías conocer",
  description:
    "AI-powered event networking. Walk into any room and instantly know who you should meet, why, and what to say.",
  openGraph: {
    title: "PRÓXIMO · Event Networking AI",
    description:
      "Hacemos visible a quién deberías conocer. AI matchmaking para eventos en vivo.",
    type: "website",
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
      <body className="min-h-full flex flex-col bg-[#0B0B12]">
        {children}
      </body>
    </html>
  );
}
