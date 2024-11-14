import { format } from "date-fns";

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

export const isValidYoutubeUrlFunc = (url: string): boolean => {
  if (url === "") return false;
  const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  return regex.test(url);
};

export function getCurrentMonthAndYear(d: any): string {
  const date = new Date(d);
  const month = date.getMonth() + 1; // Tháng trong JS bắt đầu từ 0 (0 - 11)
  const year = date.getFullYear();
  return `Tháng ${month} Năm ${year}`;
}

export function convertSecondsToYMDHMS(totalSeconds: number) {
  const secondsInMinute = 60;
  const secondsInHour = 3600; // 60 * 60
  const secondsInDay = 86400; // 24 * 60 * 60
  const secondsInMonth = 2592000; // 30 * 24 * 60 * 60 (giả sử 30 ngày)
  const secondsInYear = 31536000; // 365 * 24 * 60 * 60 (giả sử 365 ngày)

  const years = Math.floor(totalSeconds / secondsInYear);
  totalSeconds %= secondsInYear;

  const months = Math.floor(totalSeconds / secondsInMonth);
  totalSeconds %= secondsInMonth;

  const days = Math.floor(totalSeconds / secondsInDay);
  totalSeconds %= secondsInDay;

  const hours = Math.floor(totalSeconds / secondsInHour);
  totalSeconds %= secondsInHour;

  const minutes = Math.floor(totalSeconds / secondsInMinute);
  const seconds = totalSeconds % secondsInMinute;

  // Tạo một mảng để lưu các phần tử không phải 0
  const parts = [];

  // Chỉ thêm năm nếu nó lớn hơn 0
  if (years > 0) parts.push(`${years} năm`);
  if (months > 0) parts.push(`${months} tháng`);
  if (days > 0) parts.push(`${days} ngày`);
  if (hours > 0) parts.push(`${hours} giờ`);
  if (minutes > 0) parts.push(`${minutes} phút`);
  if (seconds > 0) parts.push(`${seconds} giây`);

  // Trả về kết quả dưới dạng chuỗi
  return parts.length > 0 ? parts.join(", ") : "0 giây";
}

export const formatDateConfig = (dateString: string): string => {
  if (dateString === null) {
    return "Invalid date";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    return format(date, "dd/MM/yyyy HH:mm:ss");
  } catch (error) {
    return "Invalid date";
  }
};

export const createValidData = (editorValue: any, data: any) => {
  const validData: any = [];

  for (const key in editorValue) {
    if (
      editorValue[key] !== null &&
      editorValue[key] !== "" &&
      editorValue[key] !== undefined &&
      editorValue[key] !== "null" &&
      editorValue[key] !== data[key]
    ) {
      const item = {
        path: `/${key}`,
        op: "replace",
        value: editorValue[key],
      };
      validData.push(item);
    }
  }

  return validData;
};
export const UpdateData = (data: any, editData: any) => {
  const dataUpdate = { ...data };
  for (const key in data) {
    if (data[key] !== editData[key]) {
      dataUpdate[key] = editData[key];
    }
  }
  return dataUpdate;
};

export function checkIsEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export function hasWhitespace(str: string): boolean {
  console.log("sss", str);

  return /\s/.test(str);
}

export const hasValue = (obj: Record<string, any>): boolean => {
  return Object.values(obj).some((value) => value !== "");
};
