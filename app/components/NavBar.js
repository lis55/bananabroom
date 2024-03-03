
import Image from 'next/image';

export default function Navbar() {
  // Specify the path to your logo image file relative to the public directory
  const logoSrc = '/img/logo.jpg'; // Update the file name as per your logo image
    return (
    <nav className="bg-banana-200 p-4 md:p-6 flex justify-between items-center sticky top-0 z-50">
      {/* Logo and title container */}
      <div className="flex items-center">
        {/* Logo Image */}
        <Image src={logoSrc} alt="Logo" width={100} height={100} /> {/* Adjust width and height as needed */}
        <h1 className="text-xl md:text-3xl font-bold text-charcoal ml-2"> BananaBroom</h1>
      </div>
      <button className="button">
        Login
      </button>
    </nav>
  );
}
