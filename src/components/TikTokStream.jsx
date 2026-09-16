import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, MessageCircle, X, ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "../supabaseClient";
import MusicPlayer from "./MusicPlayer";

const WELCOME_MESSAGE = {
  id: "welcome-msg",
  name: "CLB Cầu Lông Hermann 🏸",
  content:
    "Chào mừng anh, chị, em đến với bữa tiệc ngày hôm nay. Hãy gửi đến Hermann những lời chúc ấm áp nhất ❤️",
  isWelcome: true,
};

export default function TikTokStream() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Messages already streamed and displayed on screen (starting with Welcome message)
  const [displayedMessages, setDisplayedMessages] = useState([WELCOME_MESSAGE]);
  const supabaseWishesRef = useRef([]);
  const streamIndexRef = useRef(0);
  const scrollContainerRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = (behavior = "smooth") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  // Auto scroll to bottom when expanding stream
  useEffect(() => {
    if (!isMinimized) {
      const t1 = setTimeout(() => scrollToBottom("auto"), 50);
      const t2 = setTimeout(() => scrollToBottom("smooth"), 180);
      const t3 = setTimeout(() => scrollToBottom("smooth"), 350);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isMinimized]);

  // 1. Fetch from Supabase and poll every 5s for new wishes
  useEffect(() => {
    if (!supabase) return;

    const fetchWishes = async () => {
      try {
        const { data } = await supabase
          .from("wishes")
          .select("*")
          .order("created_at", { ascending: true });

        if (data && data.length > 0) {
          const formatted = data
            .map((item) => ({
              id: String(item.id || Date.now() + Math.random()),
              name: item.name || "Khách mời Hermann",
              content: item.content || item.message || item.wishes || "",
            }))
            .filter((m) => m.content);

          if (supabaseWishesRef.current.length === 0) {
            supabaseWishesRef.current = formatted;
          } else {
            // Only append genuinely new items that don't exist yet in the queue
            const existingIds = new Set(
              supabaseWishesRef.current.map((m) => String(m.id))
            );
            const newItems = formatted.filter(
              (m) => !existingIds.has(String(m.id))
            );

            if (newItems.length > 0) {
              supabaseWishesRef.current = [
                ...supabaseWishesRef.current,
                ...newItems,
              ];
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch wishes from Supabase:", err);
      }
    };

    // Initial fetch
    fetchWishes();

    // Polling every 5 seconds for new wishes
    const pollInterval = setInterval(fetchWishes, 5000);

    // Subscribe to realtime inserts
    const channel = supabase
      .channel("realtime-wishes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wishes" },
        (payload) => {
          const row = payload.new;
          if (row && (row.content || row.message)) {
            const incoming = {
              id: String(row.id || Date.now()),
              name: row.name || "Khách mời Hermann",
              content: row.content || row.message || "",
            };

            // Also ensure it is recorded in supabaseWishesRef to prevent duplicates
            if (
              !supabaseWishesRef.current.some(
                (m) => String(m.id) === incoming.id
              )
            ) {
              supabaseWishesRef.current.push(incoming);
            }

            setDisplayedMessages((prev) => {
              // Check if message is already displayed or was optimistically added
              const isDuplicate = prev.some(
                (m) =>
                  m.id === incoming.id ||
                  (String(m.id).startsWith("user-") &&
                    m.name === incoming.name &&
                    m.content === incoming.content)
              );

              if (isDuplicate) {
                // Replace temporary optimistic message with confirmed Supabase data
                return prev.map((m) =>
                  String(m.id).startsWith("user-") &&
                  m.name === incoming.name &&
                  m.content === incoming.content
                    ? incoming
                    : m
                );
              }

              return [...prev, incoming];
            });
            setTimeout(scrollToBottom, 100);
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Progressive streaming: stream Supabase messages one-by-one from oldest to newest
  useEffect(() => {
    const timer = setInterval(() => {
      const list = supabaseWishesRef.current;
      if (!list || list.length === 0) return;

      if (streamIndexRef.current < list.length) {
        const nextMsg = list[streamIndexRef.current];
        streamIndexRef.current += 1;

        setDisplayedMessages((prev) => {
          if (
            prev.some(
              (m) =>
                m.id === nextMsg.id ||
                (m.name === nextMsg.name && m.content === nextMsg.content)
            )
          ) {
            return prev;
          }
          return [...prev, nextMsg];
        });
        setTimeout(scrollToBottom, 100);
      }
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim() || isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedContent = content.trim();
    setIsSubmitting(true);

    const newMsg = {
      id: "user-" + Date.now(),
      name: trimmedName,
      content: trimmedContent,
    };

    // Update local UI immediately
    setDisplayedMessages((prev) => [...prev, newMsg]);
    setTimeout(scrollToBottom, 100);
    setName("");
    setContent("");
    setShowMessageModal(false);

    // Persist to Supabase database
    if (supabase) {
      try {
        const { error } = await supabase.from("wishes").insert([
          {
            name: trimmedName,
            content: trimmedContent,
          },
        ]);
        if (error) {
          console.error("Supabase insert error:", error);
        }
      } catch (err) {
        console.error("Failed to save to Supabase:", err);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-50 pointer-events-none h-screen flex flex-col justify-end">
      {/* Live Stream Comments Floating Overlay with Scroll */}
      {!isMinimized && (
        <div className="relative w-full px-4 pointer-events-none mb-[-40px]">
          <div
            ref={scrollContainerRef}
            className="max-h-[180px] max-w-[310px] overflow-y-auto pointer-events-auto flex flex-col gap-1.5 pr-1 overscroll-contain"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <AnimatePresence initial={false}>
              {displayedMessages.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`backdrop-blur-md rounded-2xl px-3 py-1.5 text-xs shadow-md border shrink-0 w-fit max-w-full ${
                    comment.isWelcome
                      ? "bg-rose-900/90 border-amber-300/40 text-white"
                      : "bg-rose-950/75 border-white/20 text-white"
                  }`}
                >
                  <span
                    className={`font-bold text-[12px] block ${
                      comment.isWelcome ? "text-amber-300" : "text-rose-300"
                    }`}
                  >
                    {comment.name}
                  </span>
                  <span className="text-[13px] text-white/95 font-medium leading-tight block break-words mt-0.5">
                    {comment.content}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Bottom Floating Interactive Toolbar */}
      <div className="pointer-events-auto px-4 pb-4 pt-1 w-full max-w-[430px] mx-auto flex items-end justify-between gap-2.5">
        {/* Left Interactive Group: Input + Gift (hidden when minimized) */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1 flex items-center gap-2 min-w-0"
            >
              {/* Input Trigger Button */}
              <button
                onClick={() => setShowMessageModal(true)}
                className="flex-1 min-w-0 bg-white/90 backdrop-blur-md hover:bg-white text-gray-700 text-xs font-medium px-3.5 py-2.5 rounded-full border border-pink-200 shadow-md flex items-center gap-2 transition-all cursor-pointer shadow-pink-100/50"
              >
                <MessageCircle size={15} className="text-rose-600 shrink-0" />
                <span className="truncate">Gửi lời chúc mừng...</span>
              </button>

              {/* Quick Gift Trigger */}
              <button
                onClick={() => {
                  const el = document.getElementById("gifting");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-lg border border-white hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0"
                title="Mừng sinh nhật CLB"
              >
                <Gift size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Floating Stack: Toggle Button (Top) + MusicPlayer (Bottom) */}
        <div className="flex flex-col items-center gap-2 shrink-0 ml-auto pointer-events-auto">
          {/* Minimize / Maximize stream toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-gray-600 hover:text-rose-600 border border-pink-200/80 shadow-md flex items-center justify-center transition-all cursor-pointer shadow-pink-100/40"
            title={isMinimized ? "Mở rộng" : "Thu gọn"}
          >
            {isMinimized ? (
              <ChevronUp size={18} className="text-rose-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </motion.button>

          {/* MusicPlayer */}
          <MusicPlayer />
        </div>
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMessageModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[340px] bg-white rounded-3xl p-5 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm uppercase">
                  <span>Gửi Lời Chúc Trực Tiếp</span>
                </div>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tên của bạn..."
                    className="w-full bg-rose-50/50 border border-rose-200 p-2.5 rounded-xl text-xs outline-none focus:border-rose-500 text-gray-800"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Lời chúc mừng sinh nhật CLB Hermann..."
                    className="w-full bg-rose-50/50 border border-rose-200 p-2.5 rounded-xl text-xs outline-none focus:border-rose-500 text-gray-800"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer hover:from-rose-600 hover:to-pink-600 transition-all"
                >
                  Gửi ngay
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
