/**
 * Formats a numeric string by adding commas as thousand separators.
 *
 * - First, it removes any existing commas from the input string.
 * - Then, it inserts commas every three digits from the right.
 *
 * Example:
 *   numberToCurrencyVal("1234567")   // "1,234,567"
 *   numberToCurrencyVal("12,34,567") // "1,234,567"
 *
 * @param value - The numeric string to format.
 * @returns The formatted string with commas.
 */
export const numberToCurrencyVal = (value: string) => {
  // Remove any existing commas
  const numericValue = value.replace(/,/g, "");
  // Add commas as thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
