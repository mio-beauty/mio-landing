import { ChevronRight, Clock3, File } from "lucide-react";
import { useState } from "react";

export default function QuestionSection() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  return (
    <section className="">
      <div className="px-4 py-7.5 lg:px-36">
        <div className="text-[#0B0B0B]">
          <h2 className="text-2xl lg:text-5xl font-semibold pb-2">
            Ответы на главные вопросы
          </h2>
          <p className="text-sm lg:text-[20px] font-medium">
            Все фото — наших клиентов после курса ухода
          </p>
        </div>

        <div className="flex flex-col gap-4 py-6">
          {/* 1 */}
          <div className="border-b border-[#CCCCCC]">
            <div
              onClick={() => setOpen1(!open1)}
              className="flex justify-between items-center p-4 cursor-pointer lg:hover:bg-[#F8F8F8] transition-colors"
            >
              <span className="flex items-center gap-4">
                <img src="/src/assets/img/ic_cash.svg" alt="" />
                <p className="text-[#0B0B0B] text-[16px]">Цена</p>
              </span>
              <ChevronRight
                className={`text-[#757575] transition-transform duration-300 ${
                  open1 ? "rotate-90" : ""
                }`}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                open1 ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 pb-4 text-[#0B0B0B] text-[16px] leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </div>
            </div>
          </div>

          {/* 2 */}
          <div className="border-b border-[#CCCCCC]">
            <div
              onClick={() => setOpen2(!open2)}
              className="flex justify-between items-center p-4 cursor-pointer lg:hover:bg-[#F8F8F8] transition-colors"
            >
              <span className="flex items-center gap-4">
                <File size={16} />
                <p className="text-[#0B0B0B] text-[16px]">Сертификаты</p>
              </span>
              <ChevronRight
                className={`text-[#757575] transition-transform duration-300 ${
                  open2 ? "rotate-90" : ""
                }`}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                open2 ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 pb-4 text-[#0B0B0B] text-[16px] leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </div>
            </div>
          </div>

          {/* 3 */}
          <div className="border-b border-[#CCCCCC]">
            <div
              onClick={() => setOpen3(!open3)}
              className="flex justify-between items-center gap-4 p-4 cursor-pointer lg:hover:bg-[#F8F8F8] transition-colors"
            >
              <span className="flex items-center gap-4">
                <Clock3 size={16} className="shrink-0" />
                <p className="text-[#0B0B0B] text-[16px] wrap-break-word">
                  Пояснение, за какой срок достигается эффект
                </p>
              </span>
              <ChevronRight
                className={`text-[#757575] transition-transform duration-300 shrink-0 ${
                  open3 ? "rotate-90" : ""
                }`}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                open3 ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 pb-4 text-[#0B0B0B] text-[16px] leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
