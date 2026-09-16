import { motion } from "framer-motion";
import { Car, Clock, Shirt} from "lucide-react";

export default function PartyRules() {
  const rules = [
    {
      id: "1",
      number: "01",
      tag: "AN TOÀN",
      title: "An Toàn Là Trên Hết",
      icon: <Car size={18} className="text-[#801429]" />,
      content: "Mọi người khi đã uống xe thì không lái rượu bia nha",
    },
    {
      id: "2",
      number: "02",
      tag: "ĐÚNG GIỜ",
      title: "Quy Tắc Đúng Giờ",
      icon: <Clock size={18} className="text-[#801429]" />,
      content:
        "Mọi người đến đúng giờ ạ. Nếu anh, chị, em nào đến muộn quá 20 phút thì sau thời gian ấy cứ muộn 5 phút là 1 chén ạ.",
    },
    {
      id: "3",
      number: "03",
      tag: "TRANG PHỤC",
      title: "Trang Phục",
      icon: <Shirt size={18} className="text-[#801429]" />,
      dressList: [
        { label: "Nam", text: "Mặc quần áo thoải mái ạ" },
        {
          label: "Nữ",
          text: "Mặc váy (nếu ai không mặc váy thì bị phạt 3 chén ạ) . 😁",
        },
      ],
    },
    {
      id: "4",
      number: "04",
      tag: "CAM KẾT",
      title: "Cam kết",
      icon: <Shirt size={18} className="text-[#801429]" />,
      content:
        "Khi đi mọi người cầm theo 100.000 VNĐ tiền mặt nộp cho ban tổ chức. Và sẽ được hoàn trả tại sân cầu vào sáng hôm sau ạ."
    },
  ];

  return (
    <section
      id="rules"
      className="py-10 px-0 relative z-10 w-full overflow-hidden bg-transparent"
    >
      {/* Section Header */}
      <div className="text-center mb-8 relative">
        <h2 className="text-titleSection font-sacviet text-rose-800 uppercase tracking-[1px] leading-[44px]">
          Một số lưu ý nhỏ
        </h2>
        <p className="text-[16px] text-rose-900/90 font-sacviet mt-2 leading-relaxed">
          Nhỏ thôi nhưng mọi người vẫn phải lưu ý nha
        </p>
        <div className="w-12 h-0.5 bg-rose-400 mx-auto mt-3 rounded-full mb-4"></div>
      </div>

      {/* Alternating Rules Section (So le 2 bên) */}
      <div className="space-y-10 pb-6">
        {rules.map((rule, idx) => {
          const isRight = idx % 2 === 1;
          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: isRight ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="relative w-full"
            >
              {/* Ribbon Header (So le trái / phải) */}
              <div
                className={`flex w-full ${isRight ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`bg-[#801429] text-white font-nvnvalky uppercase px-8 py-3 text-[20px] tracking-widest shadow-md ${isRight ? "rounded-l-full" : "rounded-r-full"
                    }`}
                >
                  {rule.number}: <span className="font-sacviet">{rule.tag}</span>
                </div>
              </div>

              {/* Rule Info with Vertical Divider Line & Text Content Directly Beside Line */}
              <div
                className={`px-6 mt-4 flex gap-4 ${isRight ? "flex-row-reverse" : "flex-row"
                  }`}
              >
                {/* Vertical Line */}
                <div className={`${isRight ? 'w-[2.5px]' : 'w-[1.5px]'} bg-[#801429] self-stretch rounded-full opacity-80 shrink-0`}></div>

                {/* Text Container */}
                <div
                  className={`flex flex-col justify-center gap-1 max-w-[320px] ${isRight ? "items-end text-right" : "items-start text-left"
                    }`}
                >
                  {/* Main rule text displayed directly beside vertical line */}
                  <p className="text-[#801429] text-justify font-medium text-[16px] leading-relaxed font-sans mt-0.5">
                    {rule.content}
                  </p>

                  {/* Sublist for dress code if applicable */}
                  {rule.dressList && (
                    <div className="mt-1 space-y-1 text-[16px] text-[#801429]">
                      {rule.dressList.map((item, i) => (
                        <p key={i} className="leading-snug">
                          <span className="font-bold">{item.label} : </span>
                          <span>{item.text}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
