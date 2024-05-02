import { Inter } from "next/font/google";
import "../globals.css";
import SessionProvider from "../components/SessionProvider"
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import TranslationsProvider from '../components/TranslationProvider'
import initTranslations from '../i18n';


const inter = Inter({ subsets: ["latin"] });
const i18nNamespaces = ['Home'];

/* export const metadata = {
  title: "BananaBroom cleaning and paiting service",
  description: "Cleaning and painting service for your home or office",
}; */

export default async function RootLayout({children , params: { locale }}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
        <TranslationsProvider
    namespaces={i18nNamespaces}
    locale={locale}
    resources={resources}>
        <Navbar/>
          {children}
          <Footer />
          </TranslationsProvider>
        </SessionProvider>
        
        </body>
    </html>  
  );
}

