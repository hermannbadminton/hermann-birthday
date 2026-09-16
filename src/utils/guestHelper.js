/**
 * Lấy tên khách mời từ URL Query Parameters
 * Hỗ trợ các tham số: ?to=..., ?name=..., ?guest=..., ?u=...
 * Ví dụ: https://domain.com/?to=Anh%20Tu%E1%BA%A5n
 */
export function getGuestNameFromUrl() {
  if (typeof window === "undefined") return "";
  try {
    const params = new URLSearchParams(window.location.search);
    const guestParam =
      params.get("to") ||
      params.get("name") ||
      params.get("guest") ||
      params.get("u") ||
      "";
    return guestParam.trim();
  } catch (e) {
    console.error("Lỗi khi đọc tên khách mời từ URL:", e);
    return "";
  }
}
