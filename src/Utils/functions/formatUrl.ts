/**
 * Fix duplicated URL prefixes in avatar or image URLs
 * This is needed because sometimes image URLs might have duplicated domain prefixes
 * @param url The URL to fix
 * @returns The fixed URL without duplicated prefixes
 */
export const fixDuplicatedUrlPrefixes = (url: string | null | undefined): string => {
    if (!url) return '';

    // If URL doesn't start with http, return as is
    if (!url.startsWith('http')) return url;

    // Check for duplicated http or https prefixes
    const regex = /(https?:\/\/.*?\/)(https?:\/\/)/i;
    return url.replace(regex, '$1');
}; 