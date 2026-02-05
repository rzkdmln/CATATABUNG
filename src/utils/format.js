/**
 * Format number to Rupiah currency string
 * Example: 1000000 -> Rp 1.000.000
 */
export const formatRupiah = (amount) => {
  if (amount === undefined || amount === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number with thousand separator
 * Example: 1000000 -> 1.000.000
 */
export const formatNumber = (number) => {
  if (!number) return '0';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Clean string from non-numeric characters
 * Example: "Rp 1.000.000" -> 1000000
 */
export const cleanNumber = (string) => {
  return string.replace(/\D/g, '');
};
