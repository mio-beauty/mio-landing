import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import AboutTimeline from "../components/AboutTimeline.jsx";
import { getAboutTimelineState } from "../components/aboutTimelineState.js";
import consultationImage from "../assets/img/Consultation.png";
import consultationWideImage from "../assets/img/Consultation2.png";
import certificateImage from "../assets/img/certifikat.png";
import creamImage from "../assets/img/cream.png";
import heroImage from "../assets/img/banner.jpg";
import spfImage from "../assets/img/spf.png";

const ABOUT_STEPS = [
  {
    year: "2022",
    title: "MIO yo'li kichik, lekin aniq g'oya bilan boshlandi.",
    titleLines: ["MIO yo'li kichik,", "lekin aniq g'oya", "bilan boshlandi."],
    description:
      "Birinchi bosqichda biz teri muammolarini o'rganib, mijozlarga mos parvarish tizimini shakllantirdik. E'tibor faqat chiroyli qadoqqa emas, real natijaga qaratildi.",
    primaryImage: consultationImage,
    secondaryImage: creamImage,
  },
  {
    year: "2023",
    title:
      "Brend ishga tushdi va ilk mijozlar natijani darhol sezishni boshladi.",
    titleLines: [
      "Brend ishga tushdi",
      "va ilk mijozlar",
      "natijani darhol",
      "sezishni boshladi.",
    ],
    description:
      "Mahsulotlar kundalik foydalanishga moslandi, maslahat berish jarayoni esa xizmatning muhim qismiga aylandi. Shu yilda MIO atrofida ishonchli auditoriya shakllandi.",
    primaryImage: heroImage,
    secondaryImage: spfImage,
  },
  {
    year: "2024",
    title: "Assortiment kengaydi, natijalar esa yanada tizimli bo'ldi.",
    titleLines: [
      "Assortiment kengaydi,",
      "natijalar esa yanada",
      "tizimli bo'ldi.",
    ],
    description:
      "Turli teri ehtiyojlari uchun alohida yechimlar paydo bo'ldi. Mijozlar bizni faqat mahsulot uchun emas, to'g'ri yo'nalish beradigan yondashuv uchun ham tanlay boshlashdi.",
    primaryImage: consultationWideImage,
    secondaryImage: creamImage,
  },
  {
    year: "2025",
    title: "Sifat, servis va ishonch bir nuqtada birlashdi.",
    titleLines: ["Sifat, servis va", "ishonch bir", "nuqtada birlashdi."],
    description:
      "Mahsulot sifati bo'yicha talablar kuchaytirildi, foydalanuvchi tajribasi esa yanada soddalashtirildi. Har bir bosqichda mijozga tushunarli va qulay jarayon yaratildi.",
    primaryImage: certificateImage,
    secondaryImage: consultationImage,
  },
  {
    year: "2026",
    title: "Bugun MIO parvarishni oson, estetik va natijador qiladi.",
    titleLines: [
      "Bugun MIO",
      "parvarishni oson,",
      "estetik va",
      "natijador qiladi.",
    ],
    description:
      "Bizning maqsad o'zgarmadi: har bir odamga o'z terisi uchun to'g'ri yo'lni topishga yordam berish. Brend o'smoqda, lekin markazda hamon odam va uning natijasi turibdi.",
    primaryImage: heroImage,
    secondaryImage: spfImage,
  },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function AboutSection() {
  const sectionRef = useRef(null);
  const mobileSectionRef = useRef(null);
  const mobileCardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timelineCenterX, setTimelineCenterX] = useState(
    () => getAboutTimelineState(0, ABOUT_STEPS.length).centerX,
  );
  const activeStep = ABOUT_STEPS[activeIndex];
  const titleRef = useRef(null);
  const copyRef = useRef(null);
  const mainImageRef = useRef(null);
  const smallImageRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        if (!sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const totalScrollable = Math.max(rect.height - window.innerHeight, 1);
        const passed = clamp(-rect.top, 0, totalScrollable);
        const progress = passed / totalScrollable;
        const nextState = getAboutTimelineState(progress, ABOUT_STEPS.length);

        setTimelineCenterX(nextState.centerX);
        setActiveIndex((current) =>
          current === nextState.activeIndex ? current : nextState.activeIndex,
        );
        return;
      }

      if (!mobileSectionRef.current) return;

      const rect = mobileSectionRef.current.getBoundingClientRect();
      const totalScrollable = Math.max(
        mobileSectionRef.current.offsetHeight - window.innerHeight,
        1,
      );
      const progress = clamp(-rect.top / totalScrollable, 0, 1);
      const nextIndex = Math.min(
        ABOUT_STEPS.length - 1,
        Math.round(progress * (ABOUT_STEPS.length - 1)),
      );

      setActiveIndex((current) =>
        current === nextIndex ? current : nextIndex,
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const titleLines = titleRef.current?.querySelectorAll("[data-title-line]");
    const copyNode = copyRef.current;
    const mainImageNode = mainImageRef.current;
    const smallImageNode = smallImageRef.current;

    if (!titleLines?.length || !copyNode || !mainImageNode || !smallImageNode) {
      return;
    }

    if (animationRef.current) {
      animationRef.current.kill();
    }

    gsap.set(titleLines, { yPercent: 110, opacity: 0 });
    gsap.set(copyNode, { y: 24, opacity: 0 });
    gsap.set(mainImageNode, { opacity: 0 });
    gsap.set(smallImageNode, { opacity: 0 });

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    animationRef.current = timeline;

    timeline
      .to(
        titleLines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.36,
          stagger: 0,
        },
        0,
      )
      .to(
        copyNode,
        {
          y: 0,
          opacity: 1,
          duration: 0.36,
        },
        0,
      )
      .to(
        mainImageNode,
        {
          opacity: 1,
          duration: 0.24,
          ease: "power2.out",
        },
        0,
      )
      .to(
        smallImageNode,
        {
          opacity: 1,
          duration: 0.24,
          ease: "power2.out",
        },
        0,
      );

    return () => {
      timeline.kill();
    };
  }, [activeIndex]);

  const renderTitleBlock = (step) =>
    step.titleLines.map((line, index) => (
      <span
        key={`${step.year}-${index}`}
        className="block h-[1.08em] overflow-hidden"
      >
        <span
          data-title-line
          className="block will-change-transform will-change-opacity"
        >
          {line}
        </span>
      </span>
    ));

  return (
    <section id="about" className="scroll-mt-28 bg-white pt-30">
      <div
        ref={sectionRef}
        className="hidden lg:block  "
        style={{ height: `${ABOUT_STEPS.length * 82}vh` }}
      >
        <div className="sticky top-[calc(50vh-325px)] h-[650px] overflow-hidden flex justify-center">
          <div className="mx-auto flex h-full w-full max-w-[1460px] flex-col justify-center px-6 py-10 xl:px-10 2xl:px-12">
            <div className="grid grid-cols-[620px_558px] items-center justify-between gap-6">
              <div className="flex justify-start">
                <div className="w-full">
                  <div
                    ref={titleRef}
                    className="relative min-h-[250px] overflow-hidden text-[48px] leading-[1.04] font-semibold text-[#0B0B0B]"
                  >
                    {renderTitleBlock(activeStep)}
                  </div>

                  <div className="relative mt-11 min-h-[80px] overflow-hidden pt-6">
                    <div
                      ref={copyRef}
                      className="relative will-change-transform will-change-opacity"
                    >
                      <p className="text-[16px] leading-[1.45] text-[#0B0B0B]">
                        {activeStep.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-auto grid w-fit grid-cols-[347px_79px] items-start gap-8">
                <div className="relative h-[394px] w-[347px] overflow-hidden rounded-[24px] bg-[#F5EEE7]">
                  <img
                    ref={mainImageRef}
                    src={activeStep.primaryImage}
                    alt={activeStep.title}
                    className="absolute inset-0 h-full w-full object-cover will-change-transform will-change-opacity"
                  />
                </div>

                <div className="relative h-[179px] w-[179px] overflow-hidden rounded-[24px] bg-[#F8DED0]">
                  <img
                    ref={smallImageRef}
                    src={activeStep.secondaryImage}
                    alt={`${activeStep.year} detail`}
                    className="absolute inset-0 h-full w-full object-cover will-change-transform will-change-opacity"
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0 pt-5">
              <AboutTimeline
                steps={ABOUT_STEPS}
                activeIndex={activeIndex}
                centerX={timelineCenterX}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={mobileSectionRef}
        className="relative bg-white px-4 pb-8 pt-1 lg:hidden"
      >
        <div className="relative">
          <div className="sticky top-0 z-30 mb-8 bg-white py-3">
            <h2 className="mb-0 pb-[15px] text-[32px] leading-none font-semibold tracking-[-0.06em] text-[#111111]">Bizning yo'l</h2>
            <div className="relative flex items-center justify-between px-1">
              <div className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-[#E8D8CB]" />
              {ABOUT_STEPS.map((step, index) => <div key={step.year} className={`relative z-10 flex h-8 min-w-8 items-center justify-center rounded-full px-1 text-[11px] font-semibold tracking-[-0.04em] transition-all duration-500 ${index === activeIndex ? "scale-110 bg-[#FE946E] text-[#111111] shadow-[0_5px_14px_rgba(254,148,110,0.28)]" : index < activeIndex ? "bg-[#E8D8CB] text-[#8E857E]" : "bg-[#F7EEE7] text-[#B8AEA6]"}`} style={{ fontVariantNumeric: "tabular-nums" }}>{step.year}</div>)}
            </div>
          </div>

          <div className="sticky top-[132px] z-10 mb-8">
            <article
              key={activeStep.year}
              className="about-mobile-reveal relative min-h-[680px] overflow-hidden rounded-[24px] bg-white px-1 pb-8 pt-1"
            >
              <div className="relative h-[370px] overflow-hidden rounded-[22px] bg-[#F3E5D9]">
                <img src={activeStep.primaryImage} alt={activeStep.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute bottom-4 left-4 h-[148px] w-[124px] overflow-hidden rounded-[18px] border-4 border-white bg-[#FAEEE4] shadow-[0_10px_24px_rgba(53,36,24,0.16)]">
                  <img src={activeStep.secondaryImage} alt={`${activeStep.year} detail`} className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="mt-9 px-1">
                <h3 className="text-[27px] leading-[1.1] font-semibold tracking-[-0.045em] text-[#111111]">{activeStep.title}</h3>
                <p className="mt-7 max-w-[34rem] text-[15px] leading-7 text-[#4A413B]">{activeStep.description}</p>
              </div>
            </article>
          </div>

          <div className="space-y-5">
            {ABOUT_STEPS.map((step, index) => (
              <article
                key={step.year}
                ref={(node) => {
                  mobileCardRefs.current[index] = node;
                }}
                className={[
                  "relative h-[54vh] min-h-[300px] overflow-hidden rounded-[30px] border bg-white px-4 pb-5 pt-4 opacity-0",
                  index === activeIndex
                    ? "border-[#D8B7A0] shadow-[0_18px_42px_rgba(84,56,34,0.12)]"
                    : "border-[#E9D7C8] shadow-[0_12px_30px_rgba(84,56,34,0.07)]",
                ].join(" ")}
              >
                <div className="relative">
                  <div className="relative overflow-hidden rounded-[24px] bg-[#F3E5D9]">
                    <img
                      src={step.primaryImage}
                      alt={step.title}
                      className="aspect-[0.98] w-full object-cover"
                    />

                    <div className="absolute bottom-3 right-3 h-22 w-22 overflow-hidden rounded-[18px] border border-white/70 bg-[#FAEEE4] shadow-[0_12px_24px_rgba(53,36,24,0.16)]">
                      <img
                        src={step.secondaryImage}
                        alt={`${step.year} detail`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-[26px] leading-[1.02] font-semibold tracking-[-0.04em] text-[#111111]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-6 text-[#4A413B]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
