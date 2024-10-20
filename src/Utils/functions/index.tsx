export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
export const getVideoIdFromUrl = (url: string) => {
  if (url == null) return null;
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
  );
  return match ? match[1] : null;
};
