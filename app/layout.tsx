import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Thumbnail Tuner",
  description: "A/B test your YouTube thumbnails or photos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
    <html lang="en">
      <body className={`antialiased`}>
          {children}
          <Analytics />
          <Toaster />
      </body>
    </html>
    </SessionProvider>
  );
}
