import { useState } from "react";
import alertIconImg from "../assets/img/CircleAlert.svg";
import result1Img from "../assets/img/result1.png";
import result2Img from "../assets/img/result2.png";
import result3Img from "../assets/img/result3.png";
import result4Img from "../assets/img/result4.png";

const CATEGORY_IMAGES = {
  Акне: [
    result1Img,
    result2Img,
    result3Img,
    result4Img,
    result2Img,
    result3Img,
    result1Img,
    result4Img,
  ],
  Пигментация: [result2Img, result3Img, result4Img, result1Img],
  Сухость: [result3Img, result4Img, result1Img, result2Img],
  "Жирная кожа": [result4Img, result1Img, result2Img, result3Img],
};

export default function ResultSection() {
  const [active, setActive] = useState("Акне");
  const [animating, setAnimating] = useState(false);

  const handleCategoryChange = (item) => {
    if (item === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(item);
      setAnimating(false);
    }, 200);
  };

  return (
    <section id="results" className="scroll-mt-28">
      <div className="flex flex-col py-7.5">
        <div className="px-4 text-center">
          <h2 className="text-2xl font-semibold text-[#0B0B0B] lg:text-[32px]">
            Реальные результаты до и после
          </h2>
          <p className="text-sm text-[#757575] lg:text-[16px]">
            Все фото — наших клиентов после курса ухода
          </p>
        </div>

        <div className="flex flex-col gap-7.5 py-4">
          <div className="flex gap-4 overflow-x-auto whitespace-nowrap px-4 pb-2 scrollbar-hide lg:justify-center">
            {Object.keys(CATEGORY_IMAGES).map((item) => (
              <button
                key={item}
                onClick={() => handleCategoryChange(item)}
                className={`shrink-0 rounded-3xl px-4 py-3 text-[16px] transition-all duration-300 ${
                  active === item
                    ? "bg-[#1D1D1D] text-[#FFFFFF]"
                    : "bg-[#0000000D] text-[#0B0B0B] hover:bg-[#00000019]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div
            className={`flex gap-4 overflow-x-auto px-4 scrollbar-hide transition-opacity duration-200 ${
              animating ? "opacity-0" : "opacity-100"
            }`}
          >
            {CATEGORY_IMAGES[active].map((img, index) => (
              <div
                key={`${active}-${index}`}
                className="h-99.75 w-69 shrink-0 overflow-hidden rounded-2xl"
              >
                <img
                  src={img}
                  alt={`Result ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-center">
          <button
            type="button"
            className="rounded-3xl bg-[#1D1D1D] px-4 py-3 text-[16px] text-[#FFFFFF]"
          >
            Хочу такой же результат
          </button>
          <div className="flex gap-1 text-[16px] text-[#757575]">
            <img src={alertIconImg} alt="icon" />
            <p>Получить план ухода</p>
          </div>
        </div>
      </div>
    </section>
  );
}
