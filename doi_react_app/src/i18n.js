import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import en from "./locales/en/translation"
import fr from "./locales/fr/translation"
import ru from "./locales/ru/translation"

const languages = ["en", "ru", "fr"]

i18n
    // load translation using xhr -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-xhr-backend
   // .use(Backend)
    //.use(HttpApi)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: "en",
        crossDomain: false,
        debug: true,
        whitelist: languages,
     //   backend: {
       //     loadPath: 'locales/{{lng}}/translation.json'
     //   },
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        },
        resources: {
            en: { translation: en  },
            fr: { translation: fr  },
            ru: { translation: ru  },
        }
   //     requestOptions: { // used for fetch, can also be a function (payload) => ({ method: 'GET' })
   //         mode: 'cors',
   //         credentials: 'same-origin',
   //         cache: 'default'
   //     }
    })

export default i18n
