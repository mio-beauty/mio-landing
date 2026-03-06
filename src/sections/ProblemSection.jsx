import ScrollGalleryShowcase from "../components/ScrollGalleryShowcase.jsx";
import { problemShowcaseImages } from "../data/problemShowcaseImages.js";

export default function ProblemSection() {
  return (
    <ScrollGalleryShowcase
      images={problemShowcaseImages}
      title="Жирный блеск и расширенные поры"
      buttonText="Короткое описание → чем помогает ваш продукт"
      buttonHref="/"
    />
  );
}
