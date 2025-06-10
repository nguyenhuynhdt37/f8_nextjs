/**
 * Formats a date string or Date object into a localized string format
 * @param date The date to format (ISO string or Date object)
 * @param options Optional Intl.DateTimeFormatOptions object
 * @returns Formatted date string
 */
export const formatDate = (
    date: string | Date | undefined,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }
): string => {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            return 'Invalid date';
        }

        return new Intl.DateTimeFormat('vi-VN', options).format(dateObj);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Error';
    }
};

/**
 * Formats a date as a relative time string (e.g., "2 days ago")
 * @param date The date to format (ISO string or Date object)
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date | undefined): string => {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            return 'Invalid date';
        }

        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'Vài giây trước';
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)} phút trước`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        } else if (diffInSeconds < 2592000) {
            return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
        } else if (diffInSeconds < 31536000) {
            return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
        } else {
            return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
        }
    } catch (error) {
        console.error('Error formatting relative time:', error);
        return 'Error';
    }
};

/**
 * Format a date as a short date string (DD/MM/YYYY)
 * @param date The date to format
 * @returns Short date string
 */
export const formatShortDate = (date: string | Date | undefined): string => {
    return formatDate(date, { year: 'numeric', month: '2-digit', day: '2-digit' });
};

/**
 * Format a date as a time string (HH:MM)
 * @param date The date to format
 * @returns Time string
 */
export const formatTime = (date: string | Date | undefined): string => {
    return formatDate(date, { hour: '2-digit', minute: '2-digit' });
};

export default formatDate; 