// Navbar.
'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image';
import LanguageChanger from './LanguageChanger'
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { data: session } = useSession()
  const { t } = useTranslation();
  
  const logoSrc = '/img/logo.jpg';
  
  return (
    <nav className="bg-white p-5 shadow-md fixed top-0 w-full z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Logo on the left */}
        <Image src={logoSrc} alt="Logo" width={100} height={100} className="rounded-full"/>
        
        {/* Title centered */}
        <h1 className="text-2xl font-semibold text-gray-800 flex-grow text-center">BananaBroom</h1>
        
        {/* SignIn/Out and LanguageChanger on the right */}
        <div className="flex items-center">
          {session ? (
            <button className="text-gray-800 bg-transparent hover:bg-gray-100 font-semibold py-2 px-4 mr-2 border border-gray-400 rounded-full transition duration-200 ease-in-out" onClick={() => signOut()}>
              {t('SignOut')}
            </button>
          ) : (
            <button className="text-gray-800 bg-transparent hover:bg-gray-100 font-semibold py-2 px-4 mr-3 border border-gray-400 rounded-full transition duration-200 ease-in-out" onClick={() => signIn()}>
              {t('SignIn')}
            </button>
          )}
          <LanguageChanger/>
        </div>
      </div>
    </nav>
  );
}
