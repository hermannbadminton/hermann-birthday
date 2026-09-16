import { useEffect } from "react";
import Hero from "./components/Hero";
import PartyRules from "./components/PartyRules";
import EventDetails from "./components/EventDetails";
import RSVP from "./components/RSVP";
import Gifting from "./components/Gifting";
import Footer from "./components/Footer";
import FallingHearts from "./components/FallingHearts";
import TikTokStream from "./components/TikTokStream";

function App() {
  useEffect(() => {
    // Clear hash if it exists to prevent browser jumping
    if (window.location.hash) {
      window.history.replaceState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }

    // Smooth initial scroll reset
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex justify-center w-full relative">
      {/* Dynamic Background Falling Elements (Shuttlecocks, Balloons, Hearts) */}
      <FallingHearts />

      {/* Main Mobile-First Container (max 430px) */}
      <div className="w-full max-w-[430px] bg-white/40 shadow-2xl overflow-hidden relative border-x border-pink-100/50">
        {/* 1. Hero Invitation Card Section */}
        <Hero />

        {/* 3. Event Details (Thời Gian & Địa Điểm) */}
        <EventDetails />

        {/* 2. Party Rules & Notes Section (Một Số Lưu Ý Nhỏ ạ) */}
        <PartyRules />

        {/* 7. RSVP Attendance & Live Guestbook */}
        <RSVP />

        {/* 8. Birthday Gifting & Party Funds */}
        <Gifting />

        {/* 9. Warm Thank You Footer */}
        <Footer />
      </div>

      {/* Floating Interactive Controls Layer */}
      <div className="fixed inset-0 z-[60] flex justify-center pointer-events-none">
        <div className="relative w-full max-w-[430px] pointer-events-none">
          <TikTokStream />
        </div>
      </div>
    </div>
  );
}

export default App;
