export default function Footer() {
  return (
    <footer className="w-full pt-6 pb-8 px-4 relative z-1 flex flex-col items-center text-center">
      <div className="w-full max-w-[400px] bg-gradient-to-b from-white/95 via-rose-50/90 to-rose-100/95 backdrop-blur-md rounded-3xl p-6 shadow-[0_10px_30px_rgba(230,57,86,0.12)] border border-pink-200 overflow-hidden relative">

        <h2 className="text-titleSection font-extrabold uppercase text-rose-800 tracking-wide font-sacviet mb-1">
          XIN CẢM ƠN
        </h2>

        <div className="w-12 h-0.5 bg-rose-300 mx-auto mb-4"></div>

        <p className="text-[24px] font-sacviet text-rose-800 font-semibold mt-2">
          Chúc mọi người có một ngày, một tuần, một tháng, một năm, một đời vui vẻ, hạnh phúc và tràn ngập niềm vui ❤️
        </p>
      </div>
    </footer>
  );
}
