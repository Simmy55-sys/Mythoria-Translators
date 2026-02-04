import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { cormorant, satoshi } from "./font";

export const metadata = {
  title: "Mythoria",
  description: "The Best noveels, you'd never want to miss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${satoshi.variable} font-body antialiased`}
      >
        <NextTopLoader />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
