import Navbar from "./components/NavBar";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <ContactForm />
          </div>
        </div>
        <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">

          </div>
        </div>
        {/* Add RegistrationForm and Calendar similar to above with appropriate margins */}
      </div>
      <Footer/>
    </div>
  );
}
