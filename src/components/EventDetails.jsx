import { motion } from "framer-motion";
import { Navigation} from "lucide-react";

export default function EventDetails() {
  const address = "35 P. Nguyễn Đức Cảnh, Lê Chân";
  const googleMapUrl = "https://maps.app.goo.gl/j4UeTtXPQf7z3GnG7";

  return (
    <section
      id="event-details"
      className="py-10 px-0 relative z-10 w-full overflow-hidden bg-transparent"
    >
      {/* Header section with signature typography */}
      <div className="text-center mb-0 relative">
        <h2 className="text-titleSection font-nvnvalky text-rose-800 uppercase tracking-[1px] leading-[44px]">
          THÂN MỜI
        </h2>
      </div>

      {/* Guest Name & Invitation Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center mt-2 mb-8"
      >
        <div className="relative">
          <span className="font-nvnvalky tracking-[1px] text-[clamp(26px,6vw,32px)] text-[#801429] leading-tight block">
            ANH - CHỊ - EM
          </span>
        </div>
        <div className="w-12 h-0.5 bg-rose-400 mx-auto mt-3 rounded-full"></div>
      </motion.div>

      {/* Event Details Ribbon & Info Container */}
      <div className="space-y-10 pb-6">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="relative w-full"
        >
          {/* Title Ribbon Banner */}
          <div className="flex w-full justify-end">
            <div className="bg-[#801429] text-end text-white font-nvnvalky uppercase px-8 pr-3 py-3 text-[22px] tracking-widest shadow-md rounded-l-full">
              <h1>Tiệc Sinh Nhật Lần 3</h1> 
              <h1>CLB CẦU LÔNG HERMANN</h1> 
            </div>
          </div>

          {/* Date & Time with Vertical Line & Absolute Meme */}
          <div className="px-6 mt-5 flex gap-4 flex-row-reverse relative items-center">
            {/* Vertical Line */}
            <div className="w-[1.5px] bg-[#801429] self-stretch rounded-full opacity-80 shrink-0"></div>

            {/* Text Container */}
            <div className="flex flex-col justify-center gap-1 items-end text-right">
              <p className="text-[#801429] font-bold text-[18px] tracking-wide font-sans">
                18h00 - Thứ Sáu
              </p>
              <p className="text-[#801429] font-bold text-[18px] tracking-wide font-sans">
                23 Tháng 10
              </p>
            </div>
          </div>

          {/* Venue Outline Container */}
          <div className="px-8 mt-6">
            <div className="border-[1.5px] border-[#801429] rounded-[22px] px-5 py-4 text-center relative bg-transparent shadow-xs hover:shadow-md transition-shadow">
              <p className="text-[#801429] font-bold text-[16px] mb-1.5 leading-relaxed uppercase tracking-wide">
                TẠI: NHÀ HÀNG NGƯ TRƯỜNG
              </p>
              <p className="text-[#801429] text-[14px] uppercase tracking-wide leading-relaxed">
                {address}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col items-center gap-2.5">
                <a
                  href={googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-8 py-2.5 bg-[#801429] text-white text-[12px] font-bold uppercase tracking-widest rounded-full hover:bg-opacity-90 transition-all shadow-md active:scale-95"
                >
                  <Navigation size={14} />
                  <span>XEM CHỈ ĐƯỜNG</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
