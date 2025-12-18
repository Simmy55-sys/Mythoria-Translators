import { Cormorant_Garamond } from "next/font/google";
import localFonts from "next/font/local";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const satoshi = localFonts({
  src: [
    {
      path: "../assets/fonts/satoshi/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/satoshi/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/satoshi/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/satoshi/Satoshi-Bold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/satoshi/Satoshi-Black.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});
