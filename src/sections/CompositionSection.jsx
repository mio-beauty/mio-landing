import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpfImage from "../assets/img/spf.png";

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

  const features = useMemo(
    () => [
      {
        title: "Сертификаты качества",
        text: "Проверено мировыми экспертами",
        iconSrc: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 2H7.5C6.11867 2 5 3.12 5 4.5V27.5C5 28.88 6.12 30 7.5 30H24.5C25.88 30 27 28.88 27 27.5V17C27 15.6739 26.4732 14.4021 25.5355 13.4645C24.5979 12.5268 23.3261 12 22 12H19.5C18.837 12 18.2011 11.7366 17.7322 11.2678C17.2634 10.7989 17 10.163 17 9.5V7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2ZM20.8133 16.5813C20.8933 16.4747 20.9512 16.3532 20.9836 16.2239C21.0159 16.0946 21.0221 15.9602 21.0018 15.8285C20.9815 15.6968 20.935 15.5704 20.8651 15.4569C20.7953 15.3434 20.7034 15.245 20.595 15.1675C20.4866 15.09 20.3638 15.035 20.2337 15.0056C20.1037 14.9763 19.9692 14.9732 19.838 14.9966C19.7068 15.02 19.5816 15.0694 19.4697 15.1419C19.3579 15.2144 19.2616 15.3085 19.1867 15.4187L14.872 21.4587L12.7067 19.2933C12.5171 19.1167 12.2664 19.0205 12.0073 19.0251C11.7482 19.0297 11.5011 19.1346 11.3178 19.3178C11.1346 19.5011 11.0297 19.7482 11.0251 20.0073C11.0205 20.2664 11.1167 20.5171 11.2933 20.7067L14.2933 23.7067C14.396 23.8092 14.5197 23.8882 14.656 23.9382C14.7922 23.9881 14.9377 24.0078 15.0824 23.9959C15.227 23.984 15.3673 23.9407 15.4935 23.8691C15.6197 23.7975 15.7289 23.6993 15.8133 23.5813L20.8133 16.5813Z"
              fill="#0B0B0B"
            />
            <path
              d="M17.2947 2.42139C18.3967 3.69201 19.0023 5.31812 19 7.00005V9.50005C19 9.77605 19.224 10.0001 19.5 10.0001H22C23.682 9.99772 25.3081 10.6034 26.5787 11.7054C25.9921 9.47433 24.8234 7.43912 23.1922 5.8079C21.5609 4.17669 19.5257 3.00801 17.2947 2.42139Z"
              fill="#0B0B0B"
            />
          </svg>
        ),
        posLg: "lg:left-[16%] lg:top-[-3%]",
      },
      {
        title: "Подходит для чувствительной кожи",
        text: "Подходит для чувствительной кожи",
        iconSrc: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M3.98925 21.7894C4.1853 22.2839 4.22895 22.8258 4.11458 23.3454L2.69458 27.732C2.64883 27.9545 2.66066 28.185 2.72895 28.4016C2.79724 28.6182 2.91973 28.8137 3.0848 28.9697C3.24988 29.1257 3.45206 29.237 3.67218 29.2929C3.8923 29.3488 4.12306 29.3476 4.34258 29.2894L8.89325 27.9587C9.38353 27.8615 9.89129 27.904 10.3586 28.0814C13.2058 29.411 16.4311 29.6923 19.4654 28.8757C22.4998 28.059 25.1483 26.1969 26.9435 23.6179C28.7388 21.0388 29.5654 17.9086 29.2776 14.7794C28.9899 11.6503 27.6062 8.72333 25.3707 6.51497C23.1352 4.3066 20.1915 2.95876 17.0591 2.70923C13.9267 2.45971 10.8068 3.32455 8.24984 5.15116C5.69291 6.97777 3.86329 9.64876 3.08377 12.6929C2.30425 15.737 2.62494 18.9586 3.98925 21.7894Z"
              fill="#0B0B0B"
              stroke="#0B0B0B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.4373 17.4267C9.72252 16.679 9.32518 15.6836 9.32864 14.6492C9.3321 13.6149 9.7361 12.6221 10.4558 11.8792C11.1756 11.1364 12.1551 10.7012 13.1888 10.665C14.2225 10.6289 15.2301 10.9946 15.9999 11.6854C16.5743 11.1698 17.2856 10.8314 18.0479 10.711C18.8103 10.5906 19.5912 10.6933 20.2965 11.0067C21.0018 11.3202 21.6014 11.831 22.0229 12.4776C22.4443 13.1242 22.6698 13.8789 22.6719 14.6507C22.6752 15.6851 22.2776 16.6805 21.5626 17.428L16.9666 22.2547C16.842 22.3857 16.692 22.49 16.5257 22.5613C16.3595 22.6325 16.1805 22.6692 15.9997 22.669C15.8188 22.6689 15.6399 22.632 15.4737 22.5605C15.3076 22.4891 15.1578 22.3846 15.0333 22.2534L10.4373 17.4267Z"
              fill="white"
              stroke="#0B0B0B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ),
        posLg: "lg:left-[7%] lg:top-[40%]",
      },
      {
        title: "Ингредиенты и компоненты из Европы",
        text: "Ингредиенты и компоненты из Европы",
        iconSrc: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.9999 5.06401V11.7573C13.9997 12.8181 13.5781 13.8354 12.8279 14.5853L9.65855 17.7547C12.0013 17.5896 14.3455 18.056 16.4466 19.1053C18.8041 20.2846 21.5047 20.5852 24.0639 19.9533L24.4439 19.8587L19.1719 14.5853C18.4217 13.8354 18.0001 12.8181 17.9999 11.7573V5.06401C16.6679 4.97923 15.3319 4.97923 13.9999 5.06401ZM19.9999 5.24801C20.2559 5.25033 20.5031 5.15437 20.6905 4.97988C20.8778 4.80539 20.9911 4.56568 21.007 4.31014C21.0229 4.05459 20.9402 3.80269 20.7759 3.60632C20.6116 3.40996 20.3782 3.2841 20.1239 3.25468C18.7559 3.08403 17.3785 2.99897 15.9999 3.00001C14.6213 2.9997 13.244 3.08475 11.8759 3.25468C11.6215 3.2841 11.3882 3.40996 11.2239 3.60632C11.0596 3.80269 10.9768 4.05459 10.9927 4.31014C11.0086 4.56568 11.1219 4.80539 11.3093 4.97988C11.4967 5.15437 11.7439 5.25033 11.9999 5.24801V11.7573C11.9994 12.2876 11.7884 12.796 11.4132 13.1707L3.02255 21.5627C0.862554 23.724 1.81855 27.5293 4.98389 28.0693C8.56522 28.6827 12.2466 29 15.9999 29C19.7546 29 23.4346 28.6813 27.0159 28.0707C30.1799 27.5293 31.1386 23.724 28.9759 21.5627L20.5866 13.172C20.4006 12.9863 20.2531 12.7658 20.1524 12.5231C20.0518 12.2803 19.9999 12.0201 19.9999 11.7573V5.24801Z"
              fill="#0B0B0B"
            />
          </svg>
        ),
        posLg: "lg:right-[3%] lg:top-[20%]",
      },
      {
        title: "Экологичность",
        text: "Экологичность 97,8% — без лишней химии",
        iconSrc: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M18.6667 12.7147V9.33333C18.6667 7.91885 19.2286 6.56229 20.2288 5.5621C21.229 4.5619 22.5855 4 24 4H26C26.1768 4 26.3464 4.07024 26.4714 4.19526C26.5964 4.32029 26.6667 4.48986 26.6667 4.66667V6.66667C26.6667 8.08115 26.1048 9.43771 25.1046 10.4379C24.1044 11.4381 22.7478 12 21.3333 12C19.9188 12 18.5623 12.5619 17.5621 13.5621C16.5619 14.5623 16 15.9188 16 17.3333C16 20 17.3333 21.3333 17.3333 24C17.3333 25.4425 16.8655 26.846 16 28"
              stroke="#0B0B0B"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.33325 12C6.32372 11.2571 7.50147 10.8048 8.73455 10.6936C9.96763 10.5824 11.2073 10.8168 12.3147 11.3704C13.422 11.9241 14.3534 12.7752 15.0043 13.8284C15.6552 14.8816 15.9999 16.0952 15.9999 17.3333C15.0095 18.0761 13.8317 18.5285 12.5986 18.6397C11.3655 18.7509 10.1259 18.5165 9.0185 17.9628C7.91112 17.4091 6.97981 16.558 6.32891 15.5048C5.67802 14.4517 5.33325 13.238 5.33325 12Z"
              fill="#0B0B0B"
              stroke="#0B0B0B"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.66675 28H25.3334"
              stroke="#0B0B0B"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ),
        posLg: "lg:right-[10%] lg:top-[68%]",
      },
    ],
    [],
  );

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
    <section ref={sectionRef} className="relative overflow-hidden p-16 sm:p-20">
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-15">
          <header className="lg:col-span-5 max-w-170">
            <h2
              ref={headingRef}
              className="text-[24px] font-semibold leading-[120%] text-[#0B0B0B] sm:text-[36px]"
            >
              <span data-title-line className="block">
                Натуральный состав и
              </span>
              <span data-title-line className="block">
                европейские ингредиенты
              </span>
            </h2>
            <p
              ref={paragraphRef}
              className="mt-6 text-[14px] leading-4 text-[#0B0B0B]"
            >
              Мы выбираем экологичный уход, используя минимум химии и максимум
              натуральных компонентов, чтобы ваша кожа сияла здоровьем.
            </p>
          </header>
          {/* max-w-[760px] lg:max-w-[1000px] */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto ">
              <div className="relative mx-auto h-105 w-full sm:h-120 lg:h-140">
                <div
                  ref={orbitRef}
                  className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
                >
                  <svg
                    className="h-80 w-155 opacity-70 sm:h-95 sm:w-185 lg:h-162.5 lg:w-350"
                    viewBox="0 0 920 460"
                    fill="none"
                    style={{ transform: "rotate(9.36deg)" }}
                    aria-hidden="true"
                  >
                    <ellipse
                      cx="460"
                      cy="230"
                      rx="420"
                      ry="170"
                      stroke="#CCCCCC"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>

                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-80 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),rgba(246,246,244,0)_62%)] blur-2xl sm:h-95 sm:w-95 lg:h-110 lg:w-110"
                  aria-hidden="true"
                />

                <div
                  ref={productOuterRef}
                  className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                >
                  <div ref={productInnerRef} className="will-change-transform">
                    <img
                      src={SpfImage}
                      alt="Product bottle"
                      className="h-auto w-50 select-none drop-shadow-[0_40px_70px_rgba(15,23,42,0.16)] sm:w-60 lg:w-102.25"
                      // style={{ transform: "rotate(-5deg)" }}
                      draggable="false"
                    />
                  </div>
                </div>
              </div>

              <div className="relative z-20 mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:absolute lg:inset-0 lg:mt-0 lg:block">
                {features.map((f, i) => (
                  <article
                    key={f.title}
                    className={[
                      "relative",
                      "lg:absolute",
                      "w-full lg:w-72.5 xl:w-77.5",
                      f.posLg,
                    ].join(" ")}
                    ref={(el) => {
                      cardsOuterRefs.current[i] = el;
                    }}
                  >
                    <div
                      ref={(el) => {
                        cardsFloatRefs.current[i] = el;
                      }}
                      className="will-change-transform"
                    >
                      <div
                        ref={(el) => {
                          cardsInnerRefs.current[i] = el;
                        }}
                        className="max-w-62.5 flex flex-col gap-4 items-center rounded-2xl bg-[#F8F8F8] p-6 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] will-change-transform"
                      >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white">
                          {f.iconSrc}
                        </div>
                        <div>
                          <h3 className="mt-5 text-[15px] font-medium leading-snug tracking-[-0.01em] text-slate-900">
                            {f.title}
                          </h3>
                          <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                            {f.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
