/**
 * Formats a date into a "time ago" string (e.g., "2 minutes ago")
 * @param input Date string, Date object, or undefined/null
 * @returns Formatted "time ago" string
 */
export function timeAgo(input: string | Date | undefined | null): string {
    if (!input) {
        return 'N/A';
    }

    const date = typeof input === 'string' ? new Date(input) : input;

    // Check if date is valid
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return 'Invalid date';
    }

    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
        { label: 'year', plural: 'years', seconds: 31536000 },
        { label: 'month', plural: 'months', seconds: 2592000 },
        { label: 'day', plural: 'days', seconds: 86400 },
        { label: 'hour', plural: 'hours', seconds: 3600 },
        { label: 'minute', plural: 'minutes', seconds: 60 },
        { label: 'second', plural: 'seconds', seconds: 1 }
    ];

    if (seconds < 5) {
        return 'just now';
    }

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count > 0) {
            return `${count} ${count === 1 ? interval.label : interval.plural} ago`;
        }
    }

    return 'just now';
}

export default timeAgo; 