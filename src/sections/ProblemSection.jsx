import ScrollGalleryShowcase from "../components/ScrollGalleryShowcase.jsx";
import ShowcaseConsultationCta from "../components/ShowcaseConsultationCta.jsx";
import { problemShowcaseImages } from "../data/problemShowcaseImages.js";
import { useI18n } from "../i18n/I18nProvider.jsx";

export default function ProblemSection() {
  const { t } = useI18n();

  return (
    <>
      <ScrollGalleryShowcase
        images={problemShowcaseImages}
        buttonText={t("showcase.problemButtonText")}
        buttonHref="/"
      />
      <ShowcaseConsultationCta />
    </>
  );
}
