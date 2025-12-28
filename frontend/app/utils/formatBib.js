/**
 * Format BIB number as 4-digit padded string
 * e.g., 1 -> "0001", 10 -> "0010", 100 -> "0100"
 * @param {number|string} bibNumber - The BIB number to format
 * @returns {string} - Formatted 4-digit BIB number or empty string if invalid
 */
export const formatBibNumber = (bibNumber) => {
  if (bibNumber === null || bibNumber === undefined || bibNumber === "") {
    return "";
  }
  const num = Number(bibNumber);
  if (isNaN(num)) return "";
  return String(num).padStart(4, "0");
};

/**
 * Format BIB number with prefix (e.g., "BIB #0001")
 * @param {number|string} bibNumber - The BIB number to format
 * @param {string} prefix - Optional prefix (default: "BIB #")
 * @returns {string} - Formatted BIB string or "N/A" if invalid
 */
export const formatBibWithPrefix = (bibNumber, prefix = "BIB #") => {
  const formatted = formatBibNumber(bibNumber);
  return formatted ? `${prefix}${formatted}` : "N/A";
};
