'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18nConfig from '../../i18nConfig';

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (newLocale) => {
    // Close dropdown
    setIsOpen(false);

    // Logic for changing language
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    let newPath = currentPathname;
    if (currentLocale === i18nConfig.defaultLocale && !i18nConfig.prefixDefault) {
      newPath = '/' + newLocale + currentPathname;
    } else {
      newPath = currentPathname.replace(`/${currentLocale}`, `/${newLocale}`);
    }

    router.push(newPath).then(() => router.refresh());
  };

  const languages = [
    { code: 'en', name: 'English', flagUrl: '/img/us.jpg' }, // Adjust the flag paths as needed
    { code: 'de', name: 'Deutsch', flagUrl: '/img/de.jpg' }
  ];

  return (
    <div className="language-changer">
      <div className="current-language" onClick={() => setIsOpen(!isOpen)}>
        <img src={languages.find(lang => lang.code === currentLocale).flagUrl} alt="" width="30" height="25" style={{ marginRight: '8px' }} />
        {languages.find(lang => lang.code === currentLocale).name}
        <span className="caret">▼</span>
      </div>
      {isOpen && (
        <div className="languages-dropdown">
          {languages.map(lang => (
            <div key={lang.code} className="language-option" onClick={() => handleChange(lang.code)}>
              <img src={lang.flagUrl} alt="" width="30" height="25" style={{ marginRight: '8px' }} />
              {lang.name}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
