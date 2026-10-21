export const plausibleClass = (tracking: string) => {
    // Disable tracking for now
    if (tracking) {
        return `plausible-event-name=${tracking.replace(/ /g, "+")}`;
    }
    return "";
};
export const nofollow = (link: string) => {
    if (!link.includes('drive.com.au')) {
        return 'nofollow';
    }
    return '';
}