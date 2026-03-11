import { useState } from "react";

export default function ResultSection() {
  const [active, setActive] = useState("Акне");
  const [animating, setAnimating] = useState(false);

  const categories = {
    Акне: [
      "/src/assets/img/result1.png",
      "/src/assets/img/result2.png",
      "/src/assets/img/result3.png",
      "/src/assets/img/result4.png",
      "/src/assets/img/result2.png",
      "/src/assets/img/result3.png",
      "/src/assets/img/result1.png",
      "/src/assets/img/result4.png",
    ],
    Пигментация: [
      "/src/assets/img/result5.png",
      "/src/assets/img/result6.png",
      "/src/assets/img/result7.png",
      "/src/assets/img/result8.png",
    ],
    Сухость: [
      "/src/assets/img/result9.png",
      "/src/assets/img/result10.png",
      "/src/assets/img/result11.png",
      "/src/assets/img/result12.png",
    ],
    "Жирная кожа": [
      "/src/assets/img/result13.png",
      "/src/assets/img/result14.png",
      "/src/assets/img/result15.png",
      "/src/assets/img/result16.png",
    ],
  };

  const handleCategoryChange = (item) => {
    if (item === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(item);
      setAnimating(false);
    }, 200);
  };

  return (
    <section>
      <div className="flex flex-col py-7.5">
        <div className="px-4 text-center">
          <h2 className="text-2xl lg:text-[32px] text-[#0B0B0B] font-semibold">
            Реальные результаты до и после
          </h2>
          <p className="text-sm lg:text-[16px] text-[#757575]">
            Все фото — наших клиентов после курса ухода
          </p>
        </div>

        <div className="flex flex-col gap-7.5 py-4">
          <div className="flex lg:justify-center gap-4 overflow-x-auto whitespace-nowrap pb-2 px-4 scrollbar-hide">
            {Object.keys(categories).map((item, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(item)}
                className={`shrink-0 text-[16px] py-3 px-4 rounded-3xl transition-all duration-300
                  ${
                    active === item
                      ? "bg-[#1D1D1D] text-[#FFFFFF]"
                      : "bg-[#0000000D] text-[#0B0B0B] hover:bg-[#00000019]"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* IMAGES */}
          <div
            className={`flex gap-4 overflow-x-auto px-4 scrollbar-hide transition-opacity duration-200 ${
              animating ? "opacity-0" : "opacity-100"
            }`}
          >
            {categories[active].map((img, index) => (
              <div
                key={index}
                className="w-69 h-99.75 shrink-0 rounded-2xl overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Result ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-center items-center gap-6">
          <button className="bg-[#1D1D1D] text-[#FFFFFF] text-[16px] py-3 px-4 rounded-3xl">
            Хочу такой же результат
          </button>
          <div className="flex gap-1 text-[#757575] text-[16px]">
            <img src="/src/assets/img/CircleAlert.svg" alt="icon" />
            <p>Получить план ухода</p>
          </div>
        </div>
      </div>
    </section>
  );
}
