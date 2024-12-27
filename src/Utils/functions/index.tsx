import { format } from 'date-fns';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
export const getVideoIdFromUrl = (url: string) => {
  if (url == null) return null;
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
  );
  return match ? match[1] : null;
};

export const isValidYoutubeUrlFunc = (url: string): boolean => {
  if (url === '') return false;
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
  return parts.length > 0 ? parts.join(', ') : '0 giây';
}

export const formatDateConfig = (dateString: string): string => {
  if (dateString === null) {
    return 'Invalid date';
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return format(date, 'dd/MM/yyyy HH:mm:ss');
  } catch (error) {
    return 'Invalid date';
  }
};

export const createValidData = (editorValue: any, data: any) => {
  const validData: any = [];

  for (const key in editorValue) {
    if (
      editorValue[key] !== null &&
      editorValue[key] !== '' &&
      editorValue[key] !== undefined &&
      editorValue[key] !== 'null' &&
      editorValue[key] !== data[key]
    ) {
      const item = {
        path: `/${key}`,
        op: 'replace',
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
  return /\s/.test(str);
}

export const hasValue = (obj: Record<string, any>): boolean => {
  return Object.values(obj).some(value => value !== '');
};

export function getCookieValue(cookieName: string) {
  if (typeof document !== 'undefined') {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName + '=') === 0) {
        return cookie.substring(cookieName.length + 1);
      }
    }
  }
  return null;
}
export function calculateYearsAgo(pastDate: any) {
  const currentDate = new Date();
  const past = new Date(pastDate);

  // Tính chênh lệch năm
  let yearsDifference = currentDate.getFullYear() - past.getFullYear();

  // Điều chỉnh nếu tháng/ngày chưa tới
  if (
    currentDate.getMonth() < past.getMonth() ||
    (currentDate.getMonth() === past.getMonth() &&
      currentDate.getDate() < past.getDate())
  ) {
    yearsDifference--;
  }

  // Đảm bảo trả về ít nhất là 1
  return Math.max(yearsDifference, 1);
}

export const getFileFromUrl = async (url: string): Promise<File> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const blob = await response.blob();

    // Lấy tên file từ URL (nếu có)
    const filename = url.split('/').pop() || 'unknown';

    const file = new File([blob], filename, { type: blob.type });
    return file;
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
};

export function formatCurrency2(value: any) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
}

export const TruncateMarkdown = ({ content, limit }: any) => {
  const truncatedContent =
    content.length > limit ? `${content.substring(0, limit)}...` : content;

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {truncatedContent}
    </ReactMarkdown>
  );
};

export function timeAgo(input: string | Date | undefined | null): string {
  if (!input) {
    // Nếu không có giá trị đầu vào, trả về một chuỗi mặc định
    return 'Không có thời gian';
  }

  const date = typeof input === 'string' ? new Date(input) : input;

  // Kiểm tra nếu date không hợp lệ
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Thời gian không hợp lệ';
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'năm', seconds: 60 * 60 * 24 * 365 },
    { label: 'tháng', seconds: 60 * 60 * 24 * 30 },
    { label: 'ngày', seconds: 60 * 60 * 24 },
    { label: 'giờ', seconds: 60 * 60 },
    { label: 'phút', seconds: 60 },
    { label: 'giây', seconds: 1 },
  ];

  if (seconds < 30) {
    return 'Vừa xong';
  }

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      if (interval.label === 'phút' && count === 1) {
        return 'một phút trước';
      }
      return `${count} ${interval.label} trước`;
    }
  }

  return 'Vừa xong';
}
