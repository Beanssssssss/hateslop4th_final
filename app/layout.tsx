import type { Metadata } from "next";
import { Nanum_Pen_Script } from "next/font/google";
import { SiteNav } from "./components/site-nav";
import "./globals.css";

const handwritingFont = Nanum_Pen_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-handwriting",
});

export const metadata: Metadata = {
  title: "Team Selection",
  description: "Vote for topics and build balanced project teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={handwritingFont.variable} lang="ko">
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
