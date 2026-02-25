import localFont from "next/font/local";

// IRANSans X - Works for both Farsi and English
export const iranSans = localFont({
  src: [
    {
      path: "../public/fonts/IRANSansX-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSansX-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-iran-sans",
  display: "swap",
});

// IRANSans X with Farsi Numbers (optional - if you want Persian numerals)
export const iranSansFaNum = localFont({
  src: [
    {
      path: "../public/fonts/IRANSansXFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANSansXFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-iran-sans-fa-num",
  display: "swap",
});

// YekanBakh with Farsi Numbers - Works for both Farsi and English
export const yekanBakh = localFont({
  src: [
    {
      path: "../public/fonts/YekanBakhFaNum-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/YekanBakhFaNum-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/YekanBakhFaNum-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-yekan-bakh",
  display: "swap",
});
