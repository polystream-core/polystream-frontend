/**
 * Formats a number with commas as thousand separators
 * Example usage:
 * `formatNumberWithCommas(9000000)` will return "9,000,000"
 * @param num - The number to format
 * @returns A string representation of the number with commas as thousand separators
 */
export const formatNumberWithCommas = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const resolveApyToString = (apy: number) => {
    return (apy > 0 ? "+" : "") + apy.toFixed(2) + "% APY";
}
