export function abbreviateIndian(num: number, decimals = 2) {
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  if (abs < 5e4) {
    // For values less than 50,000 show proper Indian currency commas
    const formatter = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
    return sign + formatter.format(abs);
  }

  if (abs >= 1e7) {
    // >= 1 crore (1,00,00,000)
    return sign + (abs / 1e7).toFixed(decimals).replace(/\.0+$/, "") + "Cr";
  }
  if (abs >= 1e5) {
    // >= 1 lakh (1,00,000)
    return sign + (abs / 1e5).toFixed(decimals).replace(/\.0+$/, "") + "L";
  }
  return sign + abs.toString();
}
