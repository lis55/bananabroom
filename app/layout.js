import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BananaBroom cleaning and paiting service",
  description: "Cleaning and painting service for your home or office",
};

export default function RootLayout({session, children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>   
  );
}
