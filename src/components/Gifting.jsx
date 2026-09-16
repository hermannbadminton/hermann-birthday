import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import qrImg from "../assets/qr.jpg";

export default function Gifting() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="gifting" className="py-10 px-4 relative overflow-hidden bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-[400px] mx-auto text-center"
      >
        <h2 className="text-titleSection font-extrabold uppercase text-rose-800 tracking-wide font-sacviet mb-1">
          XÂY DỰNG HERMANN
        </h2>
        <p className="text-[16px] text-rose-900/90 font-sacviet mt-2 leading-relaxed">
          Chung tay xây dựng câu lạc bộ
        </p>
        <div className="w-12 h-0.5 bg-rose-400 mx-auto mt-3 rounded-full mb-4"></div>

        {/* Gift Box Selection */}
        <div className="flex justify-center gap-6 px-2">
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-[250px] h-[250px] rounded-3xl border-2 border-rose-400 p-4 flex flex-col items-center justify-center bg-white/80 group-hover:bg-white transition-all duration-300 relative shadow-md group-hover:shadow-xl">
              <div className="text-[180px] mb-1 group-hover:scale-110 transition-transform">
                🎁
              </div>
              <div className="absolute -bottom-2 px-2.5 py-0.5 bg-rose-600 text-white text-[11px] rounded-full uppercase tracking-wider font-bold shadow-xs">
                Bấm để xem QR
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal QR Code */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[370px] bg-white rounded-3xl p-8 shadow-2xl z-10 text-center"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              {/* QR Image */}
              <div className="w-full mx-auto rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center mt-3">
                <img
                  src={qrImg}
                  alt="QR Code Hermann"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Thank You Note */}
              <p className="mt-4 text-[24px] text-rose-800 font-medium font-sacviet leading-relaxed">
                CLB Cầu Lông Hermann xin chân thành cảm ơn tình cảm & sự ủng hộ của bạn! ❤️
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
