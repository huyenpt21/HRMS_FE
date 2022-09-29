import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: function (language: any) {
        return (
          process.env.REACT_APP_LANGUAGE_FILE_LINK?.replace(
            'fileName',
            language,
          ) || ''
        );
      },
      crossDomain: true,
    },
    fallbackLng: process.env.REACT_APP_LANGUAGE_DEFAULT,
    interpolation: {
      escapeValue: false,
    },
    debug: true,
    lng:
      localStorage.getItem('locale') ||
      process.env.REACT_APP_LANGUAGE_DEFAULT ||
      'en',
  });

i18n.loadLanguages(process.env.REACT_APP_LANGUAGES?.split(',') || []);

export default i18n;
