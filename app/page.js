// Home.js
import Navbar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <HeroSection></HeroSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="p-6">
            <ContactForm />
          </div>
        </div>
        {/* Additional content goes here */}
      </div>
      <Footer />
    </div>
  );
}
