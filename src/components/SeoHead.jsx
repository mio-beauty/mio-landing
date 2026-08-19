import { useEffect } from "react";
import { useI18n } from "../i18n/I18nProvider.jsx";

const SEO_BY_LANGUAGE = {
  uz: {
    title: "MIO Beauty | Teringizga mos parvarish va kosmetika",
    description:
      "MIO Beauty — teringizga mos kosmetika, kundalik parvarish mahsulotlari va shaxsiy konsultatsiya.",
    ogLocale: "uz_UZ",
  },
  ru: {
    title: "MIO Beauty | Уход за кожей и косметика",
    description:
      "MIO Beauty — косметика, ежедневный уход за кожей и персональная консультация для вашей кожи.",
    ogLocale: "ru_RU",
  },
  en: {
    title: "MIO Beauty | Skincare and beauty products",
    description:
      "MIO Beauty — skincare products, daily beauty care and personal consultations for your skin.",
    ogLocale: "en_US",
  },
};

export default function SeoHead() {
  const { language } = useI18n();

  useEffect(() => {
    const seo = SEO_BY_LANGUAGE[language] ?? SEO_BY_LANGUAGE.uz;
    const setMeta = (selector, content) => {
      const element = document.head.querySelector(selector);
      if (element) element.setAttribute("content", content);
    };

    document.title = seo.title;
    document.documentElement.lang = language;
    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[property="og:locale"]', seo.ogLocale);
    setMeta('meta[name="twitter:title"]', seo.title);
    setMeta('meta[name="twitter:description"]', seo.description);

    const schema = document.getElementById("seo-schema");
    if (schema) {
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://miobeauty.uz/#organization",
            name: "MIO Beauty",
            url: "https://miobeauty.uz/",
            logo: "https://miobeauty.uz/favicon.svg",
            description: seo.description,
          },
          {
            "@type": "WebSite",
            "@id": "https://miobeauty.uz/#website",
            url: "https://miobeauty.uz/",
            name: "MIO Beauty",
            publisher: { "@id": "https://miobeauty.uz/#organization" },
            inLanguage: language,
          },
        ],
      });
    }
  }, [language]);

  return null;
}
