import { useLayoutEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutSection from "../sections/AboutSection.jsx";
import CompositionSection from "../sections/CompositionSection.jsx";
import ConsultationSection from "../sections/ConsultationSection.jsx";
import HomeSection from "../sections/HomeSection.jsx";
import ProblemSection from "../sections/ProblemSection.jsx";
import ProductsSection from "../sections/ProductsSection.jsx";
import QuestionSection from "../sections/QuestionSection.jsx";
import ReviewSection from "../sections/ReviewSection.jsx";
import TrustSection from "../sections/TrustSection.jsx";
import LoadingIntro from "../components/LoadingIntro.jsx";

export default function LandingPage() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;

    let rafTwo = 0;

    const refreshScrollLayout = () => {
      ScrollTrigger.refresh();
    };

    const rafOne = window.requestAnimationFrame(() => {
      rafTwo = window.requestAnimationFrame(refreshScrollLayout);
    });

    const onLoad = () => {
      window.requestAnimationFrame(refreshScrollLayout);
    };

    window.addEventListener("load", onLoad);

    return () => {
      window.cancelAnimationFrame(rafOne);
      if (rafTwo) window.cancelAnimationFrame(rafTwo);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <>
      <LoadingIntro />
      <HomeSection />
      <TrustSection />
      <ProblemSection />
      <CompositionSection />
      <ProductsSection />
      <ReviewSection />
      <QuestionSection />
      <ConsultationSection />
      <div className="hidden lg:block">
        <AboutSection />
      </div>
    </>
  );
}
