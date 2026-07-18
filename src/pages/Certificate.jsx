import Navbar from "../components/Navbar";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import certificateImg from "../assets/img/certifikat.png";

export default function CertificatePage() {
  const certificates = [
    certificateImg,
    certificateImg,
    certificateImg,
    certificateImg,
    certificateImg,
    certificateImg,
  ];

  return (
    <section>
      <div className="flex flex-col  lg:px-36 min-h-screen">
        <Navbar textColor="dark" />

        <div className="px-4 lg:px-0">
          <div className="flex flex-col gap-2.5 py-4 lg:py-8">
            <h2 className="text-[#0B0B0B] text-4xl lg:text-5xl font-semibold">
              Наши сертификаты
            </h2>

            <div className="flex items-center gap-1 text-sm text-[#757575]">
              <Link to="/" className="">
                Главная
              </Link>
              <ChevronRight size={14} />
              <p>Сертификаты</p>
            </div>
          </div>

          <div className="flex justify-center py-3 lg:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {certificates.map((img, index) => (
                <div key={index} className="w-full overflow-hidden">
                  <img
                    src={img}
                    alt="Certificate"
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
