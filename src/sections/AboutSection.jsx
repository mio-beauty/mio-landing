export default function AboutSection() {
  return (
    <section>
      <div className="px-4 py-7.5 lg:py-30 lg:px-36 ">
        <h2 className="text-[#0B0B0B] text-2xl font-semibold pb-4 lg:pb-4.25 lg:text-5xl">
          Мы — доверенная косметика с 6-летним опытом.
        </h2>

        <div className="flex flex-col lg:flex-row lg:gap-3.75 pt-4.25 border-t border-[#EDEDED]">
          <div className="pt-4.25 lg:pt-0 lg:w-[30%]">
            <p className="text-[#0B0B0B] text-[16px]">
              Компания работает с 2022 года.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row py-6 lg:py-0  gap-3.75 lg:w-[70%]">
            <div>
              <p className="text-[#0B0B0B] text-[16px]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing
              </p>
            </div>

            <div>
              <p className="text-[#0B0B0B] text-[16px]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
