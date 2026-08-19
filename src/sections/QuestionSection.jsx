import { ChevronRight, Clock3, File } from "lucide-react";
import { useState } from "react";
import cashIconImg from "../assets/img/ic_cash.svg";
import { useI18n } from "../i18n/I18nProvider.jsx";

export default function QuestionSection() {
  const { get, t } = useI18n();
  const items = get("faq.items", []);
  const [openStates, setOpenStates] = useState([false, false, false]);

  const toggleItem = (index) => {
    setOpenStates((prev) =>
      prev.map((value, currentIndex) =>
        currentIndex === index ? !value : value,
      ),
    );
  };

  const icons = [
    <img key="cash" src={cashIconImg} alt="" />,
    <File key="file" size={16} />,
    <Clock3 key="clock" size={16} className="shrink-0" />,
  ];

  return (
    <section id="questions" className="scroll-mt-28">
      <div className="px-4 py-7.5 lg:px-36">
        <div className="text-[#0B0B0B]">
          <h2 className="pb-2 text-2xl font-semibold lg:text-5xl">
            {t("faq.title")}
          </h2>
          <p className="text-sm font-medium lg:text-[20px]">
            {t("faq.description")}
          </p>
        </div>

        <div className="flex flex-col gap-4 py-6">
          {items.map((item, index) => (
            <div key={item.title} className="border-b border-[#CCCCCC]">
              <div
                onClick={() => toggleItem(index)}
                className="flex cursor-pointer items-center justify-between gap-4 p-4 transition-colors lg:hover:bg-[#F8F8F8]"
              >
                <span className="flex items-center gap-4">
                  {icons[index]}
                  <p className="text-[16px] text-[#0B0B0B]">{item.title}</p>
                </span>
                <ChevronRight
                  className={`shrink-0 text-[#5F5F5F] transition-transform duration-300 ${
                    openStates[index] ? "rotate-90" : ""
                  }`}
                />
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openStates[index] ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 pb-4 text-[16px] leading-relaxed text-[#0B0B0B]">
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
