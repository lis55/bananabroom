// Navbar.js
import Image from 'next/image';

export default function Navbar() {
  const logoSrc = '/img/logo.jpg';
  return (
    <nav className="bg-white p-5 shadow-md fixed top-0 w-full z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Image src={logoSrc} alt="Logo" width={50} height={50} className="rounded-full"/>
        <h1 className="text-2xl font-semibold text-gray-800">BananaBroom</h1>
        <button className="text-gray-800 bg-transparent hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-400 rounded transition ease-in-out duration-150">
          Login
        </button>
      </div>
    </nav>
  );
}
