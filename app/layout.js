import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider"

const inter = Inter({ subsets: ["latin"] });

/* export const metadata = {
  title: "BananaBroom cleaning and paiting service",
  description: "Cleaning and painting service for your home or office",
}; */

export default async function RootLayout({children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
        </body>
    </html>  
  );
}

