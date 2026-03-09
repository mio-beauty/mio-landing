export default function ReviewSection() {
  return (
    <div className="flex flex-col lg:px-36 py-4 lg:py-[64px]">
      <div className="w-full px-4 lg:px-0 lg:pb-2">
        <h3 className="text-[#0B0B0B] text-4xl lg:text-5xl leading-[115%] font-semibold">
          Почему нам доверяют
        </h3>
      </div>

      <div className="w-full flex flex-col">
        <div className="flex items-center gap-4 border-b border-[#ECECEE] py-6 px-4 lg:justify-between lg:px-0 lg:gap-0">
          <h2 className="min-w-[60px] font-semibold text-5xl lg:text-7xl text-[#C4C4CC]">
            01
          </h2>

          <div className="flex flex-col justify-between text-[#0B0B0B] lg:w-[50%]">
            <h5 className="text-[20px] lg:text-2xl font-semibold">
              Ингредиенты из Европы
            </h5>
            <p className="text-[16px]">Сертифицированные компоненты из ЕС</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-[#ECECEE] py-6 px-4 lg:justify-between lg:px-0 lg:gap-0">
          <h2 className="min-w-[60px] font-semibold text-5xl lg:text-7xl text-[#C4C4CC]">
            02
          </h2>

          <div className="flex flex-col justify-between text-[#0B0B0B] lg:w-[50%]">
            <h5 className="text-[20px] lg:text-2xl font-semibold">
              24/7 поддержка
            </h5>
            <p className="text-[16px]">
              Всегда на связи в мессенджерах, в приложении, по телефону
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-[#ECECEE] py-6 px-4 lg:justify-between lg:px-0 lg:gap-0">
          <h2 className="min-w-[60px] font-semibold text-5xl lg:text-7xl text-[#C4C4CC]">
            03
          </h2>

          <div className="flex flex-col justify-between text-[#0B0B0B] lg:w-[50%]">
            <h5 className="text-[20px] lg:text-2xl font-semibold">
              Доставка в день заказа
            </h5>
            <p className="text-[16px]">По городу ташкент</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-[#ECECEE] py-6 px-4 lg:justify-between lg:px-0 lg:gap-0">
          <h2 className="min-w-[60px] font-semibold text-5xl lg:text-7xl text-[#C4C4CC]">
            04
          </h2>

          <div className="flex flex-col justify-between text-[#0B0B0B] lg:w-[50%]">
            <h5 className="text-[20px] lg:text-2xl font-semibold">
              100 000+ клиентов
            </h5>
            <p className="text-[16px]">Тысячи девушек уже прошли курс ухода</p>
          </div>
        </div>

        <div className="flex items-center gap-4 py-6 px-4 lg:justify-between lg:px-0 lg:gap-0">
          <h2 className="min-w-[60px] font-semibold text-5xl lg:text-7xl text-[#C4C4CC]">
            05
          </h2>

          <div className="flex flex-col justify-between text-[#0B0B0B] lg:w-[50%]">
            <h5 className="text-[20px] lg:text-2xl font-semibold">
              92% довольных клиентов
            </h5>
            <p className="text-[16px]">По результатам опросов клиентов</p>
          </div>
        </div>
      </div>
    </div>
  );
}
