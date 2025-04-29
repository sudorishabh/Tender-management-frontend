import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import RootProvider from "../components/RootProvider";
import Header from "../components/Header/Header";
import PersistentUser from "@/components/Auth/PersistentUser";
import { Toaster } from "@/components/ui/sonner";

const robotoMono = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Teri Tender Management",
  description: "Teri Tender Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        {/* <script
          crossOrigin='anonymous'
          src='//unpkg.com/react-scan/dist/auto.global.js'
        /> */}
      </head>
      <body
        className={`${robotoMono.className} antialiased bg-white min-h-svh`}>
        <RootProvider>
          <PersistentUser>
            <Header />
            <main>{children}</main>
            <Toaster
              richColors
              theme='light'
              className='custom-toaster '
              position='top-center'
              closeButton={true}
            />
          </PersistentUser>
        </RootProvider>
      </body>
    </html>
  );
}
