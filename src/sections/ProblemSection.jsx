import ScrollGalleryShowcase from "../components/ScrollGalleryShowcase.jsx";
import ShowcaseConsultationCta from "../components/ShowcaseConsultationCta.jsx";
import { problemShowcaseImages } from "../data/problemShowcaseImages.js";

export default function ProblemSection() {
  return (
    <>
      <ScrollGalleryShowcase
        images={problemShowcaseImages}
        buttonText="Какую проблему кожи помогаем решить"
        buttonHref="/"
      />
      <ShowcaseConsultationCta />
    </>
  );
}
