const REVIEW_ITEMS = [
  {
    id: "01",
    title: "Ингредиенты из Европы",
    description: "Сертифицированные компоненты из ЕС",
  },
  {
    id: "02",
    title: "24/7 поддержка",
    description: "Всегда на связи в мессенджерах, в приложении, по телефону",
  },
  {
    id: "03",
    title: "Доставка в день заказа",
    description: "По городу ташкент",
  },
  {
    id: "04",
    title: "100 000+ клиентов",
    description: "Тысячи девушек уже прошли курс ухода",
  },
  {
    id: "05",
    title: "92% довольных клиентов",
    description: "По результатам опросов клиентов",
  },
];

export default function ReviewSection() {
  return (
    <div className="flex flex-col lg:px-36 py-4 lg:py-16">
      <div className="w-full px-4 lg:px-0 lg:pb-2">
        <h3 className="text-[#0B0B0B] text-4xl lg:text-5xl leading-[115%] font-semibold">
          Почему нам доверяют
        </h3>
      </div>

      <div className="w-full flex flex-col">
        {REVIEW_ITEMS.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 px-4 lg:justify-between lg:px-0 lg:gap-0 ${
              index !== REVIEW_ITEMS.length - 1
                ? "border-b border-[#ECECEE]"
                : ""
            } py-6`}
          >
            <h2 className="min-w-15 font-normal text-5xl lg:text-7xl text-[#C4C4CC]">
              {item.id}
            </h2>

            <div className="flex-1 flex-col justify-between text-[#0B0B0B] lg:w-[1/2] lg:max-w-[50%]">
              <h5 className="text-[20px] lg:text-2xl font-semibold">
                {item.title}
              </h5>
              <p className="text-[16px]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
