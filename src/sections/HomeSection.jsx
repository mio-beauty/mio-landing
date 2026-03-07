import Navbar from "../components/Navbar.jsx";
import heroImg from "../assets/imags/hero-img.png";
import heroImg2 from "../assets/imags/hero2.png"

export default function HomeSection() {

  return (
    <section
      className="bg-[#FFFFFF] lg:bg-[#D0C1AD] bg-no-repeat bg-cover lg:bg-right
             bg-[image:var(--hero-mobile)]
             lg:bg-[image:var(--hero-desktop)]"

             style={{
            "--hero-mobile": `url(${heroImg2})`,
            "--hero-desktop": `url(${heroImg})`,
          }}
          >
      <div className="lg:h-screen lg:px-36">
        <div className="min-h-screen flex flex-col justify-between pb-6 lg:pb-0">
          <Navbar />

        <div className="text-[#FFFFFF] lg:px-0 px-4 lg:absolute lg:bottom-[422px] lg:left-0 lg:px-[120px]">
          <h1 className="lg:text-[64px] text-[32px]  font-normal leading-[100%] lg:max-w-[600px] max-w-[300px]">
            Решение проблем кожи лица{" "}
          </h1>
          <p className="text-[16px]  font-normal leading-[120%] mt-4">
            Акне | Пигментация | Сухость | Чувствительность
          </p>
        </div>
        </div>

        <div className="lg:absolute lg:bottom-[60px] lg:left-0 lg:px-[120px] w-full flex flex-col lg:flex-row items-start lg:items-center lg:gap-14 lg:text-[#FFFFFF] text-[#0B0B0B] bg-[#FFFFFF] lg:bg-transparent lg:pt-52">
          <div className="w-full px-4 py-6 border-b-2 border-[#ECECEE] lg:px-0 lg:w-[33%] lg:border-b-0 lg:border-r-2 lg:border-[#EDEDED] lg:py-6">
            <p className="font-medium text-[16px] leading-[20px]">клиентов</p>
            <h3 className="text-7xl font-normal leading-[120%]">100 000+</h3>
          </div>

          <div className="w-full px-4 py-6 border-b-2 border-[#ECECEE] lg:px-0 lg:w-[33%] lg:border-b-0 lg:border-r-2 lg:border-[#EDEDED] lg:py-6">
            <p className="font-medium text-[16px] leading-[20px]">
              довольных результатов
            </p>
            <h3 className="text-7xl font-normal leading-[120%]">92%</h3>
          </div>

          <div className="w-full px-4 py-6 lg:px-0 lg:w-[33%] lg:py-6">
            <p className="font-medium text-[16px] leading-[20px]">
              Доставка в день заказа
            </p>
            <h3 className="text-7xl font-normal leading-[120%]">300+</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
