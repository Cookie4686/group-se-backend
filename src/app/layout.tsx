import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import TopMenu from "@/components/TopMenu";
import "./globals.css";

export const metadata: Metadata = {
  title: "icl ts pmo",
  description: "The coolest CoworkingSpace Reservation app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="mt-12">
        <SessionProvider>
          <TopMenu />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
