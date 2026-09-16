import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { useGuest } from "../context/GuestContext";

export default function RSVP() {
  const { guestName } = useGuest();
  const [formData, setFormData] = useState({
    name: guestName || "",
    phone: "",
    attending: "yes",
    guests: "1",
    wishes: "",
  });

  useEffect(() => {
    if (guestName) {
      setFormData((prev) => ({ ...prev, name: guestName }));
    }
  }, [guestName]);


  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitted(true);

    // 1. Send RSVP data to Google Sheet
    const googleSheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;
    if (googleSheetUrl) {
      try {
        const payload = {
          name: formData.name.trim(),
          phone: "'"+formData.phone.trim(),
          attending: formData.attending === "yes" ? "Tham gia" : "Không tham gia",
          guests: formData.guests,
          timestamp: new Date().toLocaleString("vi-VN"),
        };

        await fetch(googleSheetUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn("Google Sheet submission notice:", err);
      }
    }

    // Trigger fireworks event or sound
    window.dispatchEvent(
      new CustomEvent("user-rsvp-submitted", {
        detail: { name: formData.name },
      })
    );
  };

  return (
    <section id="rsvp" className="py-10 px-4 relative w-full overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-titleSection font-extrabold uppercase text-rose-800 tracking-wide font-sacviet"
        >
          Xác Nhận Tham Dự
        </motion.h2>
        <p className="text-[14px] sm:text-[16px] text-rose-900/90 font-sacviet mt-2 leading-relaxed">
          Sự hiện diện của mọi người là niềm vinh dự cho nhóm
        </p>
        <div className="w-12 h-0.5 bg-rose-400 mx-auto mt-3 rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[400px] mx-auto bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-[0_10px_30px_rgba(230,57,86,0.1)] border border-pink-100"
      >
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-3"
          >
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-rose-800">
              Gửi Xác Nhận Thành Công!
            </h3>
            <p className="text-gray-700 text-[14px] leading-relaxed">
              Cảm ơn <span className="font-bold text-rose-600">{formData.name}</span> đã phản hồi. CLB Cầu Lông Hermann rất mong chờ được hội ngộ cùng bạn tại bữa tiệc!
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: guestName || "",
                  phone: "",
                  attending: "yes",
                  guests: "1",
                  wishes: "",
                });
              }}
              className="mt-4 px-5 py-2 bg-pink-100 hover:bg-pink-200 text-rose-800 text-[12px] font-bold uppercase rounded-xl transition-colors"
            >
              Gửi phản hồi khác
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1.5"
              >
                Họ & Tên của bạn *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-rose-50/40 border border-rose-200 focus:border-rose-500 focus:bg-white p-3 rounded-xl outline-none text-gray-800 text-[14px] transition-all"
                placeholder="VD: Nguyễn Văn A..."
              />
            </div>

            {/* Phone Input */}
            <div>
              <label
                htmlFor="phone"
                className="block text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1.5"
              >
                Số Điện Thoại / Zalo
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-rose-50/40 border border-rose-200 focus:border-rose-500 focus:bg-white p-3 rounded-xl outline-none text-gray-800 text-[14px] transition-all"
                placeholder="VD: 0912 345 678..."
              />
            </div>

            {/* Attending Radio */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-2">
                Bạn sẽ tham dự chứ? *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.attending === "yes"
                      ? "bg-rose-50 border-rose-500 text-rose-900 font-bold shadow-xs"
                      : "bg-white border-rose-100 text-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    checked={formData.attending === "yes"}
                    onChange={(e) =>
                      setFormData({ ...formData, attending: e.target.value })
                    }
                    className="accent-rose-600"
                  />
                  <span className="text-[13px]">Có, có mặt! 🏸</span>
                </label>

                <label
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.attending === "no"
                      ? "bg-gray-100 border-gray-400 text-gray-900 font-bold"
                      : "bg-white border-rose-100 text-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    checked={formData.attending === "no"}
                    onChange={(e) =>
                      setFormData({ ...formData, attending: e.target.value })
                    }
                    className="accent-gray-600"
                  />
                  <span className="text-[13px]">Tiếc quá, bận 🥺</span>
                </label>
              </div>
            </div>

            {/* Guests Count */}
            {formData.attending === "yes" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1.5">
                  Số người tham dự
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData({ ...formData, guests: e.target.value })
                  }
                  className="w-full bg-rose-50/40 border border-rose-200 focus:border-rose-500 focus:bg-white p-3 rounded-xl outline-none text-gray-800 text-[14px] transition-all"
                >
                  <option value="1">1 người (Đi một mình)</option>
                  <option value="2">2 người (Cùng người thương/bạn bè)</option>
                  <option value="3">3 người trở lên</option>
                </select>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-[14px] uppercase tracking-wider rounded-xl shadow-lg shadow-rose-400/30 flex items-center justify-center gap-2 transform active:scale-98 transition-all cursor-pointer"
            >
              <Send size={18} />
              <span>Gửi Xác Nhận Ngay</span>
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
