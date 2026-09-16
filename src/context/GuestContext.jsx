/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const GuestContext = createContext({
  guestName: "",
  slug: "",
  isLoading: true,
});

export function GuestProvider({ children }) {
  const [guestName, setGuestName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function resolveGuest() {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      // 1. Trích xuất slug từ Pathname (ví dụ: domain.com/hailong -> "hailong")
      let rawSlug = "";
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, ""); // Bỏ dấu / ở đầu & cuối
      
      // Bỏ qua các file tĩnh hoặc route mặc định
      const ignoredPaths = ["index.html", "favicon.ico", "robots.txt", "assets"];
      if (pathname && !ignoredPaths.some((p) => pathname.startsWith(p))) {
        rawSlug = pathname;
      }

      // 2. Nếu không có ở pathname, kiểm tra Query Params (?to=..., ?u=..., ?slug=..., ?name=...)
      if (!rawSlug) {
        const params = new URLSearchParams(window.location.search);
        rawSlug =
          params.get("to") ||
          params.get("u") ||
          params.get("slug") ||
          params.get("guest") ||
          params.get("name") ||
          "";
      }

      rawSlug = rawSlug.trim();
      setSlug(rawSlug);

      if (!rawSlug) {
        setIsLoading(false);
        return;
      }

      // 3. Kiểm tra cache trong SessionStorage để tải ngay lập tức không bị giật UI
      const cacheKey = `guest_cache_${rawSlug.toLowerCase()}`;
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setGuestName(cached);
          setIsLoading(false);
        }
      } catch (e) {
        console.warn("Storage warning:", e);
      }

      // 4. Nếu có Supabase, truy vấn tìm theo slug trong bảng 'guests'
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("guests")
            .select("name, slug")
            .ilike("slug", rawSlug)
            .maybeSingle();

          if (data && data.name) {
            setGuestName(data.name);
            try {
              sessionStorage.setItem(cacheKey, data.name);
            } catch (e) {
              console.warn("Storage warning:", e);
            }
            setIsLoading(false);
            return;
          }
          if (error) {
            console.warn("Supabase guest fetch warning:", error.message);
          }
        } catch (err) {
          console.warn("Lỗi khi tìm khách mời trong Supabase:", err);
        }
      }

      // 5. Fallback nếu không tìm thấy trong DB:
      // Nếu là query param dạng chữ có khoảng trắng/dấu (ví dụ: ?to=Anh Tuấn) thì lấy luôn tên
      try {
        const decoded = decodeURIComponent(rawSlug);
        // Nếu chứa dấu cách hoặc ký tự tiếng Việt có dấu thì coi như truyền tên trực tiếp
        if (decoded.includes(" ") || /[à-ỹÀ-Ỹ]/i.test(decoded)) {
          setGuestName(decoded);
        } else if (!supabase) {
          setGuestName(decoded);
        }
      } catch {
        setGuestName(rawSlug);
      }

      setIsLoading(false);
    }

    resolveGuest();
  }, []);

  return (
    <GuestContext.Provider value={{ guestName, slug, isLoading }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  return useContext(GuestContext);
}
