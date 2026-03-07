import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CompositionIntro from "./composition/CompositionIntro.jsx";
import CompositionVisual from "./composition/CompositionVisual.jsx";
import { compositionFeatures } from "./composition/compositionFeatures.jsx";

export default function CompositionSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const orbitRef = useRef(null);
  const productOuterRef = useRef(null);
  const productInnerRef = useRef(null);

  const cardsOuterRefs = useRef([]);
  const cardsFloatRefs = useRef([]);
  const cardsInnerRefs = useRef([]);
  const cardIconRefs = useRef([]);

  const features = useMemo(() => compositionFeatures, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          motionOk: "(prefers-reduced-motion: no-preference)",
        },
        (mctx) => {
          const { isDesktop, motionOk } = mctx.conditions;
          if (!motionOk) return undefined;

          const titleLines =
            headingRef.current?.querySelectorAll("[data-title-line]") ?? [];

          const cardsOuter = cardsOuterRefs.current.filter(Boolean);
          const cardsFloat = cardsFloatRefs.current.filter(Boolean);
          const cardsInner = cardsInnerRefs.current.filter(Boolean);
          const cardIcons = cardIconRefs.current.filter(Boolean);

          gsap.set([titleLines, paragraphRef.current], {
            autoAlpha: 0,
            y: 14,
            filter: "blur(10px)",
          });
          gsap.set(orbitRef.current, { autoAlpha: 0, scale: 0.985 });
          gsap.set(productInnerRef.current, {
            autoAlpha: 0,
            y: 18,
            scale: 0.96,
            filter: "blur(6px)",
          });
          gsap.set(cardsOuter, {
            autoAlpha: 0,
            y: 14,
            x: (i) => (i < 2 ? -10 : 10),
            filter: "blur(8px)",
          });

          const tl = gsap.timeline({
            defaults: { ease: "power3.out", duration: 0.9 },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              toggleActions: "play none none none",
              once: true,
            },
          });

          tl.to(titleLines, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.12,
            duration: 0.95,
            ease: "power3.out",
          })
            .to(
              paragraphRef.current,
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.85,
                ease: "power3.out",
              },
              "-=0.55",
            )
            .to(
              orbitRef.current,
              {
                autoAlpha: 1,
                scale: 1,
                duration: 1.05,
                ease: "power2.out",
              },
              "-=0.8",
            )
            .to(
              productInnerRef.current,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1.05,
                ease: "power3.out",
              },
              "-=0.75",
            )
            .to(
              cardsOuter,
              {
                autoAlpha: 1,
                y: 0,
                x: 0,
                filter: "blur(0px)",
                duration: 0.85,
                ease: "power3.out",
                stagger: { each: 0.12, from: "start" },
              },
              "-=0.75",
            );

          tl.add(() => {
            gsap.to(productInnerRef.current, {
              y: -8,
              duration: 7.2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
            cardsFloat.forEach((el, i) => {
              gsap.to(el, {
                y: i % 2 === 0 ? -5 : -7,
                duration: 8.5 + i * 0.7,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 0.2 + i * 0.15,
              });
            });
          }, "+=0.05");

          let removeParallax = null;
          if (isDesktop) {
            const root = sectionRef.current;
            const qProductX = gsap.quickTo(productOuterRef.current, "x", {
              duration: 0.65,
              ease: "power2.out",
            });
            const qProductY = gsap.quickTo(productOuterRef.current, "y", {
              duration: 0.65,
              ease: "power2.out",
            });
            const qOrbitX = gsap.quickTo(orbitRef.current, "x", {
              duration: 0.75,
              ease: "power2.out",
            });
            const qOrbitY = gsap.quickTo(orbitRef.current, "y", {
              duration: 0.75,
              ease: "power2.out",
            });
            const cardQuick = cardsOuter.map((el) => ({
              x: gsap.quickTo(el, "x", { duration: 0.7, ease: "power2.out" }),
              y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power2.out" }),
            }));

            const onMove = (e) => {
              const r = root.getBoundingClientRect();
              const nx = (e.clientX - r.left) / r.width - 0.5;
              const ny = (e.clientY - r.top) / r.height - 0.5;

              qOrbitX(nx * 8);
              qOrbitY(ny * 6);
              qProductX(nx * 16);
              qProductY(ny * 12);

              cardQuick.forEach((q, i) => {
                const strength = 18 + i * 2.2;
                q.x(nx * strength);
                q.y(ny * (strength * 1.1));
              });
              // qOrbitX(nx * 4);
              // qOrbitY(ny * 3);
              // qProductX(nx * 8);
              // qProductY(ny * 6);

              // cardQuick.forEach((q, i) => {
              //   const strength = 11 + i * 1.4;
              //   q.x(nx * strength);
              //   q.y(ny * (strength * 0.8));
              // });
            };

            const onLeave = () => {
              qOrbitX(0);
              qOrbitY(0);
              qProductX(0);
              qProductY(0);
              cardQuick.forEach((q) => {
                q.x(0);
                q.y(0);
              });
            };

            root.addEventListener("mousemove", onMove, { passive: true });
            root.addEventListener("mouseleave", onLeave, { passive: true });
            removeParallax = () => {
              root.removeEventListener("mousemove", onMove);
              root.removeEventListener("mouseleave", onLeave);
            };
          }

          const hoverCleanup = [];
          cardsInner.forEach((el, i) => {
            const icon = cardIcons[i];

            const onEnter = () => {
              gsap.to(el, {
                y: -8,
                duration: 0.55,
                ease: "power2.out",
              });
              gsap.to(el, {
                boxShadow: "0 34px 90px rgba(15,23,42,0.16)",
                duration: 0.55,
                ease: "power2.out",
              });
              if (icon) {
                gsap.to(icon, {
                  scale: 1.06,
                  duration: 0.55,
                  ease: "power2.out",
                });
              }
            };

            const onLeave = () => {
              gsap.to(el, {
                y: 0,
                duration: 0.7,
                ease: "power3.out",
              });
              gsap.to(el, {
                boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
                duration: 0.7,
                ease: "power3.out",
              });
              if (icon) {
                gsap.to(icon, {
                  scale: 1,
                  duration: 0.7,
                  ease: "power3.out",
                });
              }
            };

            el.addEventListener("pointerenter", onEnter);
            el.addEventListener("pointerleave", onLeave);
            hoverCleanup.push(() => {
              el.removeEventListener("pointerenter", onEnter);
              el.removeEventListener("pointerleave", onLeave);
            });
          });

          return () => {
            hoverCleanup.forEach((fn) => fn());
            if (removeParallax) removeParallax();
          };
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-5 py-10 sm:px-10 sm:py-14 lg:p-16"
    >
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-10 lg:gap-15">
          <CompositionIntro headingRef={headingRef} paragraphRef={paragraphRef} />
          {/* max-w-[760px] lg:max-w-[1000px] */}
          <div className="lg:col-span-7">
            <CompositionVisual
              orbitRef={orbitRef}
              productOuterRef={productOuterRef}
              productInnerRef={productInnerRef}
              features={features}
              cardsOuterRefs={cardsOuterRefs}
              cardsFloatRefs={cardsFloatRefs}
              cardsInnerRefs={cardsInnerRefs}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
