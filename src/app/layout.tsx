import "./globals.css";
import { cormorant, satoshi } from "./font";
import { Toaster } from "sonner";

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
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
