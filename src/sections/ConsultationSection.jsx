import { useState, useEffect } from "react";
import { Check, ChevronDown, LoaderCircle } from "lucide-react";

export default function ConsultationSection() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", phone: "", problem: "" });
  const [errors, setErrors] = useState({ name: false, phone: false });

  useEffect(() => {
    if (status === "success" || status === "error" || status === "failed") {
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const options = ["Акне", "Пигментация", "Сухость"];

  const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, "");
    if (numbers.startsWith("998")) numbers = numbers.slice(3);

    let formatted = "+998";
    if (numbers.length > 0) formatted += " " + numbers.slice(0, 2);
    if (numbers.length > 2) formatted += " " + numbers.slice(2, 5);
    if (numbers.length > 5) formatted += " " + numbers.slice(5, 7);
    if (numbers.length > 7) formatted += " " + numbers.slice(7, 9);

    return formatted;
  };

  const handlePhoneChange = (e) => {
    setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
  };

  const handlePhoneFocus = () => {
    if (!form.phone) setForm((prev) => ({ ...prev, phone: "+998 " }));
  };

  const handlePhoneBlur = () => {
    if (form.phone === "+998 ") setForm((prev) => ({ ...prev, phone: "" }));
  };

  const handleNameChange = (e) => {
    setForm((prev) => ({ ...prev, name: e.target.value }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
  };

  const handleClick = () => {
    const phoneNumbers = form.phone.replace(/\D/g, "");

    const newErrors = {
      name: !form.name.trim(),
      phone:
        !form.phone.trim() ||
        form.phone === "+998 " ||
        phoneNumbers.length < 12,
    };

    setErrors(newErrors);

    if (newErrors.phone) {
      setForm((prev) => ({ ...prev, phone: "" }));
    }

    if (newErrors.name || newErrors.phone) return;

    setStatus("loading");

    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", phone: "", problem: "" });
      setOpen(false);
    }, 1000);
  };

  return (
    <section className="bg-[#F8F8F8]">
      <div className="relative px-4 py-8 lg:px-[134px] lg:py-36 flex flex-col justify-center">
        {/* TITLE */}
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-[#0B0B0B] text-2xl lg:text-5xl font-medium leading-tight">
            <span>
              Не знаете, с чего начать?
              <img
                className="hidden lg:inline-block px-3 align-middle"
                src="/src/assets/img/Consultation2.png"
                alt=""
              />
              Получите
            </span>
            <span className="block mt-2">
              <img
                className="hidden lg:inline-block px-3 align-middle"
                src="/src/assets/img/Consultation.png"
                alt=""
              />
              бесплатную консультацию косметолога
              <img
                className="hidden lg:inline-block px-3 align-middle"
                src="/src/assets/img/Consultation3.png"
                alt=""
              />
            </span>
          </h2>
          <p className="text-[#0000007c] text-sm pt-3 lg:text-[20px]">
            Ответим на вопросы о коже, подберём уход, расскажем, как
            использовать продукты
          </p>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-6 py-6 lg:pt-28 lg:px-96 text-[#757575]">
          {/* ISM */}
          <div className="relative px-3 py-2.5 border-b border-[#CCCCCC]">
            <input
              className="border-none outline-none text-sm text-[#0B0B0B] w-full bg-transparent"
              type="text"
              placeholder={!errors.name ? "Ваше имя" : ""}
              value={form.name}
              onChange={handleNameChange}
            />
            {errors.name && !form.name && (
              <span className="absolute left-3 top-2.5 text-sm pointer-events-none text-[#9CA3AF]">
                Ваше имя <span className="text-red-500">*</span>
              </span>
            )}
          </div>

          {/* TELEFON */}
          <div className="relative px-3 py-2.5 border-b border-[#CCCCCC]">
            <input
              className="border-none outline-none text-sm text-[#0B0B0B] w-full bg-transparent"
              type="text"
              inputMode="tel"
              placeholder={!errors.phone ? "Ваш телефон номер" : ""}
              value={form.phone}
              onChange={handlePhoneChange}
              onFocus={handlePhoneFocus}
              onBlur={handlePhoneBlur}
            />
            {errors.phone && !form.phone && (
              <span className="absolute left-3 top-2.5 text-sm pointer-events-none text-[#9CA3AF]">
                Ваш телефон номер <span className="text-red-500">*</span>
              </span>
            )}
          </div>

          {/* CUSTOM SELECT */}
          <div className="relative px-3 py-2.5 border-b text-sm border-[#CCCCCC]">
            <div
              className="flex justify-between"
              onClick={() => setOpen(!open)}
            >
              <span
                className={form.problem ? "text-[#0B0B0B]" : "text-[#757575]"}
              >
                {form.problem || "Акне, пигментация, сухость и т.д."}
              </span>

              <ChevronDown
                size={20}
                className={`transition cursor-pointer text-[#757575] ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>

            {open && (
              <ul className="absolute left-0 w-full bg-[#FFFFFF] border border-[#CCCCCC] rounded overflow-hidden z-50">
                {options.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setForm((prev) => ({ ...prev, problem: item }));
                      setOpen(false);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* BUTTON + TEXT */}
          <div className="flex flex-col lg:flex-row-reverse lg:items-center lg:justify-between gap-3.5 pt-8">
            <button
              onClick={handleClick}
              disabled={status === "loading"}
              className="flex items-center justify-center gap-2 text-[16px] w-full lg:w-[30%] text-white bg-[#1D1D1D] p-2.5 lg:py-3 rounded-lg cursor-pointer hover:bg-[#1d1d1de1] duration-300"
            >
              {status === "idle" && "Получить консультацию"}
              {status === "loading" && (
                <LoaderCircle className="animate-spin" />
              )}
              {status === "success" && <Check />}
              {status === "error" && "Получить консультацию"}
              {status === "failed" && "Получить консультацию"}
            </button>

            <p className="text-sm text-[#757575] text-center">
              Консультация бесплатная. На связи 24/7
            </p>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="flex flex-col items-center lg:px-96">
          <div className="absolute bottom-0 translate-y-1/2 w-full flex flex-col items-center gap-3 z-50 px-4 lg:px-[432px]">
            {status === "error" && (
              <div className="flex flex-col lg:flex-row items-center justify-between gap-2 bg-[#000000D9] border border-[#757575] py-2.5 px-3 rounded-[12px]">
                <div className="flex lg:items-start items-center gap-2">
                  <img src="/src/assets/img/ic_error.svg" alt="" />
                  <p className="text-[#FFFFFF] text-[16px]">
                    Вы достигли лимита на отправку сообщений, пожалуйста,
                    попробуйте позже
                  </p>
                </div>
                <div className="hidden lg:flex justify-between items-center gap-2">
                  <button className="bg-[#FFFFFF4D] text-[#FFFFFF] font-medium text-sm rounded-[6px] py-2 px-3">
                    Инфо
                  </button>
                  <div className="border-[#FFFFFF4D] h-5 border"></div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="bg-[#FFFFFF] text-[#0B0B0B] font-medium text-sm rounded-[6px] py-2 px-3"
                  >
                    закрыть
                  </button>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center justify-between bg-[#000000D9] border border-[#757575] py-2.5 px-3 rounded-[12px] lg:w-[60%] w-full">
                <div className="flex items-center gap-2">
                  <img src="/src/assets/img/ic_check_filled.svg" alt="" />
                  <p className="text-[#FFFFFF] text-[16px]">
                    Ваше сообщение отправлено
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="hidden lg:block bg-[#FFFFFF] text-[#0B0B0B] font-medium text-sm rounded-[6px] py-2 px-3"
                >
                  закрыть
                </button>
              </div>
            )}

            {status === "failed" && (
              <div className="flex items-center justify-between bg-[#000000D9] border border-[#757575] py-2.5 px-3 rounded-[12px] lg:w-[60%] w-full">
                <div className="flex items-center gap-2">
                  <img src="/src/assets/img/ic_close_filled.svg" alt="" />
                  <p className="text-[#FFFFFF] text-[16px]">
                    Ваше сообщение не отправлено
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="hidden lg:block bg-[#FFFFFF] text-[#0B0B0B] font-medium text-sm rounded-[6px] py-2 px-3"
                >
                  закрыть
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
