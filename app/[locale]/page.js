
import HeroSection from "../components/HeroSection";
import ContactForm from "../components/ContactForm";
import initTranslations from '../i18n';
import TranslationsProvider from '../components/TranslationProvider'
import ClientStripeWrapper from'../components/StripeWrapper'



const i18nNamespaces = ['Home', 'MyAccount'];

export default async function Home({ params: { locale } }) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <TranslationsProvider
    namespaces={i18nNamespaces}
    locale={locale}
    resources={resources}>
    <div className="bg-gray-50">

      <ClientStripeWrapper>
      <HeroSection></HeroSection>
      </ClientStripeWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="p-6">
            <ContactForm />
          </div>
        </div>
        {/* Additional content goes here */}
      </div>
    </div>
    </TranslationsProvider>
  );
}