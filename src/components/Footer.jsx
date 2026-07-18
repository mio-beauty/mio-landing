import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import footerLogoImg from "../assets/img/Logo-footer.svg";
import footerOrangeLogoImg from "../assets/img/Logo-footer-orange.svg";

export default function Footer() {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState(false);

  const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, "");
    if (numbers.startsWith("998")) numbers = numbers.slice(3);
    numbers = numbers.slice(0, 9);

    if (numbers.length === 0) return "+998 ";

    let formatted = "+998";
    if (numbers.length > 0) formatted += " " + numbers.slice(0, 2);
    if (numbers.length > 2) formatted += " " + numbers.slice(2, 5);
    if (numbers.length > 5) formatted += " " + numbers.slice(5, 7);
    if (numbers.length > 7) formatted += " " + numbers.slice(7, 9);

    return formatted;
  };

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
    if (error) setError(false);
  };

  const handlePhoneFocus = () => {
    setFocused(true);
    if (!phone) setPhone("+998 ");
  };

  const handlePhoneBlur = () => {
    setFocused(false);
    if (phone === "+998 " || phone === "+998") setPhone("");
  };

  const handleSubmit = () => {
    const phoneNumbers = phone.replace(/\D/g, "");

    if (!phone.trim() || phone === "+998 " || phoneNumbers.length < 12) {
      setPhone("");
      setError(true);
      return;
    }

    // API call shu yerda
    setPhone("");
    setError(false);
  };

  return (
    <section className="bg-[#1D1D1E] text-white">
      <div className="p-3 lg:pb-[102px]">
        <img
          className="w-full h-auto"
          src={footerLogoImg}
          alt=""
        />
      </div>

      <div className="flex flex-col lg:px-20">
        <div className="hidden lg:block pb-6">
          <img src={footerOrangeLogoImg} alt="logo" />
        </div>

        <div className="flex items-start flex-col lg:flex-row lg:justify-between px-4 lg:px-0">
          <div className="flex py-7 pb-0 lg:text-2xl lg:order-2 gap-12">
            <ul className="flex flex-col text-sm gap-3">
              <li className="font-semibold">Инфо</li>
              <li>Результаты</li>
              <li>Сертификаты</li>
              <li>Состав</li>
              <li>Отзывы</li>
            </ul>

            <ul className="flex flex-col text-sm gap-3">
              <li className="font-semibold">Контакты</li>
              <li className="flex">
                <a href="#">Telegram</a>
                <ArrowUpRight size={16} />
              </li>
              <li className="flex">
                <a href="#">Instagram</a>
                <ArrowUpRight size={16} />
              </li>
              <li className="flex">
                <a href="#">Facebook</a>
                <ArrowUpRight size={16} />
              </li>
              <li>+998 90 001 04 44</li>
              <li>support@miobeauty.uz</li>
            </ul>
          </div>

          <div className="lg:order-1 lg:w-[50%]">
            <p className="text-2xl lg:text-[32px] font-semibold">
              Свяжитесь с нами для получения дополнительной информации
            </p>

            <div className="flex flex-col gap-2 py-6 pb-0 text-sm">
              <p>Телефон</p>

              <div className="flex flex-col gap-2 lg:flex-row">
                <div className="relative lg:w-[60%]">
                  <input
                    className={`w-full bg-[#FFFFFF] border-none outline-none px-3 py-2.5 rounded-lg ${
                      focused || phone ? "text-[#0B0B0B]" : "text-[#757575]"
                    }`}
                    placeholder={!error ? "+998" : ""}
                    type="text"
                    inputMode="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    onFocus={handlePhoneFocus}
                    onBlur={handlePhoneBlur}
                  />

                  {error && !phone && !focused && (
                    <span className="absolute left-3 top-2.5 text-sm pointer-events-none text-[#757575]">
                      +998<span className="text-red-500">*</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  className="flex justify-center items-center font-medium bg-[#FFFFFF] text-[#0B0B0B] border-none px-5 py-2.5 rounded-3xl"
                >
                  Получить консультацию
                  <ArrowRight size={18} />
                </button>
              </div>

              <p className="text-[#757575] text-[16px]">
                Бесплатная консультация косметолога 24/7
              </p>
            </div>
          </div>
        </div>

        <div className="text-[#757575] text-lg px-4 lg:px-0 lg:pt-8 pb-10 lg:flex items-center justify-between">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-[18px] py-2.5 font-medium text-sm lg:order-2">
            <a href="#" className="border-b border-[#757575] w-fit">
              Политика конфиденциальности
            </a>
            <a href="#" className="border-b border-[#757575] w-fit">
              Пользовательское соглашение
            </a>
            <a href="#" className="border-b border-[#757575] w-fit">
              Сертификаты
            </a>
          </div>

          <p className="mt-4 text-sm lg:order-1">
            © 2025 MIOBEAUTY, Все права защищены
          </p>
        </div>
      </div>
    </section>
  );
}
