import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import RootProvider from "../components/RootProvider";
import Header from "../components/Header/Header";
import PersistLogin from "@/components/Auth/PersistLogin";
import { Toaster } from "@/components/ui/sonner";

const robotoMono = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TERI Tenders",
  description:
    "TERI Tenders is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.",
  keywords:
    "TERI Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System",
  icons: {
    icon: "/TERI_LOGO.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${robotoMono.className} antialiased bg-white min-h-svh`}>
        <RootProvider>
          <PersistLogin>
            <Header />
            <main>{children}</main>
            <Toaster
              richColors
              theme='light'
              className='custom-toaster '
              position='top-center'
              closeButton={true}
            />
          </PersistLogin>
        </RootProvider>
      </body>
    </html>
  );
}
