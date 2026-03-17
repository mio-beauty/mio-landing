import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import heroImg from "../assets/imags/hero-img.png";
import heroImg2 from "../assets/imags/hero2.png";
import { ArrowRight } from "lucide-react";

export default function HomeSection() {
  const categories = ["АКНЕ", "ПИГМЕНТАЦИЯ", "СУХОСТЬ", "ЧУСТВИТЕЛЬНОСТЬ"];

  const stats = [
    { value: 100000, text: "Клиентов выбрали MIO Beauty", suffix: "+" },
    { value: 92, text: "Клиентов возвращаются снова", suffix: "%" },
    { value: 300, text: "Заказов доставляем в день заказа", suffix: "+" },
  ];

  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const timer = setInterval(() => {
            setCounts((prev) => {
              const allDone = prev.every((count, i) => count >= stats[i].value);
              if (allDone) {
                clearInterval(timer);
                return prev;
              }
              return prev.map((count, i) => {
                if (count < stats[i].value) {
                  return Math.min(
                    count + Math.ceil(stats[i].value / 50),
                    stats[i].value,
                  );
                }
                return stats[i].value;
              });
            });
          }, 20);
        }
      },
      { threshold: 0.3 },
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      className="bg-[#FFFFFF] lg:bg-[#D0C1AD] bg-no-repeat bg-cover lg:bg-right
             bg-(image:--hero-mobile)
             lg:bg-(image:--hero-desktop)"
      style={{
        "--hero-mobile": `url(${heroImg2})`,
        "--hero-desktop": `url(${heroImg})`,
      }}
    >
      <div className="lg:h-screen lg:px-36">
        <div className="min-h-screen flex flex-col justify-between pb-6 lg:pb-0">
          <Navbar />

          <div className="text-[#FFFFFF] pb-16 lg:px-0 px-4 lg:absolute lg:top-[245px] lg:left-0 lg:px-[120px]">
            <div className="flex flex-wrap gap-3 overflow-x-auto whitespace-nowrap">
              {categories.map((item, index) => (
                <button
                  key={index}
                  className="text-[16px] text-[#0B0B0B] bg-[#FFFFFF] font-medium px-2 py-1 rounded-2xl"
                >
                  {item}
                </button>
              ))}
            </div>

            <h1 className="lg:text-[59px] text-[32px] font-normal leading-[100%] lg:max-w-[55%] lg:pt-6 py-4">
              Поможем подобрать уход под проблему вашей кожи
            </h1>

            <p className="text-lg font-normal leading-[120%] pt-2.5">
              Не знаете, с чего начать уход?
            </p>

            <p className="text-lg font-normal leading-[120%]">
              Подскажем, какие средства подойдут именно вашей коже
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:gap-6 gap-4 lg:absolute lg:bottom-6 lg:left-0 lg:px-30 w-full relative">
          <div
            ref={statsRef}
            className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:text-[#FFFFFF] text-[#0B0B0B] lg:bg-transparent bg-[#FFFFFF]"
          >
            {stats.map((item, index) => (
              <div
                key={index}
                className="w-full p-6 lg:w-[33%] rounded-2xl bg-[#FFFFFF33]"
              >
                <h3 className="text-7xl font-normal leading-[120%]">
                  {counts[index]}
                  {item.suffix}
                </h3>

                <p className="font-medium text-[16px] leading-5">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="px-4 lg:px-0 w-full absolute -top-18 lg:static">
            <button className="text-[16px] text-[#0B0B0B] font-medium flex justify-center w-full gap-1 bg-[#FFFFFF] py-4 rounded-full">
              Получить подбор ухода <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
