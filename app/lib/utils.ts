import {v4 as uuidv4} from 'uuid'
import {twMerge} from "tailwind-merge";
import {type ClassValue, clsx} from "clsx";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Convert a byte size to a human-readable string in KB, MB, or GB (base 1024).
 * - Chooses the largest suitable unit among KB, MB, GB.
 * - Formats with up to 2 decimal places (trims trailing zeros).
 * - Values less than 1 KB are shown as 0 KB.
 * - Invalid or negative inputs return "0 KB".
 */

export function formatSize(bytes: number): string {
    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;

    if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";

    let value: number;
    let unit: "KB" | "MB" | "GB";

    if (bytes >= GB) {
        value = bytes / GB;
        unit = "GB";
    } else if (bytes >= MB) {
        value = bytes / MB;
        unit = "MB";
    } else {
        value = bytes / KB; // Anything under 1KB becomes fractional KB which will round down to 0.00 if tiny
        unit = "KB";
    }

    // Format with up to 2 decimals, trimming trailing zeros
    const formatted = stripTrailingZeros(toFixedMax(value, 2));
    return `${formatted} ${unit}`;
}

/**
 * Like toFixed but keeps up to `digits` decimals, not always exactly `digits`.
 */
export function toFixedMax(num: number, digits: number): string {
    // Use Intl for better rounding behavior, fallback to toFixed
    try {
        const formatter = new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: digits,
        });
        return formatter.format(num);
    } catch {
        return num.toFixed(digits);
    }
}

export function stripTrailingZeros(input: string): string {
    // If Intl added grouping separators, just return as-is (we won't try to strip zeros then)
    if (/[\s,\.]/.test("")) {
        // No-op placeholder; we'll handle generic cases below
    }
    // Normalize: if there is a decimal separator, remove unnecessary zeros.
    // We need to detect the locale's decimal separator. We'll assume '.' as a safe default for code usage.
    // If Intl formatted with comma decimal, we won't strip zeros to avoid altering meaning across locales.
    if (input.includes('.')) {
        return input.replace(/\.0+$|\.(\d*[1-9])0+$/, '.$1').replace(/\.$/, '');
    }
    return input;
}


export const generateUUID = () => uuidv4()