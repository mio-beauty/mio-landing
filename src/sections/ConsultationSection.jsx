import { useState, useEffect } from "react";
import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import consultationImg from "../assets/img/Consultation.png";
import consultationWideImg from "../assets/img/Consultation2.png";
import consultationAltImg from "../assets/img/Consultation3.png";
import checkFilledIconImg from "../assets/img/ic_check_filled.svg";
import closeFilledIconImg from "../assets/img/ic_close_filled.svg";
import errorIconImg from "../assets/img/ic_error.svg";
import { useI18n } from "../i18n/I18nProvider.jsx";

export default function ConsultationSection() {
  const { get, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", phone: "", problem: "" });
  const [errors, setErrors] = useState({ name: false, phone: false });
  const options = get("consultation.options", []);

  useEffect(() => {
    if (status === "success" || status === "error" || status === "failed") {
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

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
    setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
  };

  const handlePhoneFocus = () => {
    if (!form.phone) setForm((prev) => ({ ...prev, phone: "+998 " }));
  };

  const handlePhoneBlur = () => {
    if (form.phone === "+998 " || form.phone === "+998") {
      setForm((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleNameChange = (e) => {
    setForm((prev) => ({ ...prev, name: e.target.value }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
  };

  const handleClick = async () => {
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

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Contact form request failed");

      setStatus("success");
      setForm({ name: "", phone: "", problem: "" });
      setOpen(false);
    } catch {
      setStatus("failed");
    }
  };

  return (
    <section id="contacts" className="scroll-mt-28 bg-[#F8F8F8]">
      <div className="relative flex flex-col items-center justify-center px-4 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-16 lg:py-28 xl:px-24 xl:py-36 2xl:px-32">
        <span id="contact" className="absolute -top-28" aria-hidden="true" />
        <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-3 text-center">
          <h2 className="text-[clamp(1.75rem,4.2vw,3rem)] font-medium leading-[1.08] text-[#0B0B0B]">
            <span>
              {t("consultation.titleStart")}
              <img
                className="hidden h-[1.15em] w-auto px-2 align-middle lg:inline-block xl:px-3"
                src={consultationWideImg}
                alt=""
              />
              {t("consultation.titleMiddle")}
            </span>
            <span className="mt-2 block">
              <img
                className="hidden h-[1.15em] w-auto px-2 align-middle lg:inline-block xl:px-3"
                src={consultationImg}
                alt=""
              />
              {t("consultation.titleEnd")}
              <img
                className="hidden h-[1.15em] w-auto px-2 align-middle lg:inline-block xl:px-3"
                src={consultationAltImg}
                alt=""
              />
            </span>
          </h2>
          <p className="mx-auto max-w-[760px] pt-3 text-sm leading-[1.45] text-[#555555] sm:text-base lg:text-[20px]">
            {t("consultation.description")}
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5 py-8 text-[#5F5F5F] sm:gap-6 sm:py-10 lg:pt-20">
          <div className="relative border-b border-[#CCCCCC] px-3 py-2.5">
            <input
              className="w-full border-none bg-transparent text-sm text-[#0B0B0B] outline-none"
              type="text"
              placeholder={!errors.name ? t("consultation.namePlaceholder") : ""}
              value={form.name}
              onChange={handleNameChange}
            />
            {errors.name && !form.name && (
              <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-[#9CA3AF]">
                {t("consultation.nameLabel")}{" "}
                <span className="text-red-500">*</span>
              </span>
            )}
          </div>

          <div className="relative border-b border-[#CCCCCC] px-3 py-2.5">
            <input
              className="w-full border-none bg-transparent text-sm text-[#0B0B0B] outline-none"
              type="text"
              inputMode="tel"
              placeholder={!errors.phone ? t("consultation.phonePlaceholder") : ""}
              value={form.phone}
              onChange={handlePhoneChange}
              onFocus={handlePhoneFocus}
              onBlur={handlePhoneBlur}
            />
            {errors.phone && !form.phone && (
              <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-[#9CA3AF]">
                {t("consultation.phoneLabel")}{" "}
                <span className="text-red-500">*</span>
              </span>
            )}
          </div>

          <div className="relative">
            <div className="border-b border-[#CCCCCC] px-3 py-2.5 text-sm">
              <div
                className="flex cursor-pointer items-center justify-between"
                onClick={() => setOpen(!open)}
              >
                <span
                  className={form.problem ? "text-[#0B0B0B]" : "text-[#757575]"}
                >
                  {form.problem || t("consultation.problemPlaceholder")}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-[#757575] transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div
              className={`absolute left-0 top-full z-50 mt-1 w-full origin-top transition-all duration-300 ${
                open
                  ? "pointer-events-auto scale-y-100 opacity-100"
                  : "pointer-events-none scale-y-0 opacity-0"
              }`}
            >
              <ul className="overflow-hidden rounded-xl bg-white shadow-[0_0_24px_rgba(41,42,53,0.1)]">
                {options.map((item) => (
                  <li
                    key={item}
                    onClick={() => {
                      setForm((prev) => ({ ...prev, problem: item }));
                      setOpen(false);
                    }}
                    className="cursor-pointer px-3 py-2 transition-colors hover:bg-gray-100"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-7 sm:pt-8 lg:flex-row-reverse lg:items-center lg:justify-between">
            <button
              onClick={handleClick}
              disabled={status === "loading"}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1D1D1D] p-3 text-[15px] text-white duration-300 hover:bg-[#1d1d1de1] sm:text-[16px] lg:w-[240px] lg:shrink-0 lg:py-3"
            >
              {status === "idle" && t("consultation.cta")}
              {status === "loading" && (
                <LoaderCircle className="animate-spin" />
              )}
              {status === "success" && <Check />}
              {status === "error" && t("consultation.cta")}
              {status === "failed" && t("consultation.cta")}
            </button>

            <p className="text-center text-xs leading-[1.4] text-[#5F5F5F] sm:text-sm lg:text-left">
              {t("consultation.helper")}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="fixed inset-x-4 bottom-6 z-50 flex flex-col items-center gap-3 sm:inset-x-8 lg:inset-x-auto lg:left-1/2 lg:w-[calc(100%-4rem)] lg:max-w-[720px] lg:-translate-x-1/2">
            {status === "error" && (
              <div className="flex flex-col items-center justify-between gap-2 rounded-xl border border-[#757575] bg-[#000000D9] px-3 py-2.5 lg:flex-row">
                <div className="flex items-center gap-2 lg:items-start">
                  <img src={errorIconImg} alt="" />
                  <p className="text-[16px] text-[#FFFFFF]">
                    {t("consultation.notifications.error")}
                  </p>
                </div>
                <div className="hidden items-center justify-between gap-2 lg:flex">
                  <button className="rounded-md bg-[#FFFFFF4D] px-3 py-2 text-sm font-medium text-[#FFFFFF]">
                    {t("consultation.notifications.info")}
                  </button>
                  <div className="h-5 border border-[#FFFFFF4D]"></div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="rounded-md bg-[#FFFFFF] px-3 py-2 text-sm font-medium text-[#0B0B0B]"
                  >
                    {t("consultation.notifications.close")}
                  </button>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex w-full items-center justify-between rounded-xl border border-[#757575] bg-[#000000D9] px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <img src={checkFilledIconImg} alt="" />
                  <p className="text-[16px] text-[#FFFFFF]">
                    {t("consultation.notifications.success")}
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="hidden rounded-md bg-[#FFFFFF] px-3 py-2 text-sm font-medium text-[#0B0B0B] lg:block"
                >
                  {t("consultation.notifications.close")}
                </button>
              </div>
            )}

            {status === "failed" && (
              <div className="flex w-full items-center justify-between rounded-xl border border-[#757575] bg-[#000000D9] px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <img src={closeFilledIconImg} alt="" />
                  <p className="text-[16px] text-[#FFFFFF]">
                    {t("consultation.notifications.failed")}
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="hidden rounded-md bg-[#FFFFFF] px-3 py-2 text-sm font-medium text-[#0B0B0B] lg:block"
                >
                  {t("consultation.notifications.close")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
