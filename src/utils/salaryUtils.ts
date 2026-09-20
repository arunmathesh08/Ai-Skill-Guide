/**
 * Utility functions for consistent salary formatting across SkillBridge.
 * Removes fake / random values and ensures clean standard display.
 */

export function formatSalary(salary?: string | null): string {
  if (!salary || typeof salary !== 'string' || !salary.trim()) {
    return 'Salary not available';
  }

  const trimmed = salary.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower === 'n/a' ||
    lower === 'na' ||
    lower === 'not specified' ||
    lower === 'undefined' ||
    lower === 'null' ||
    lower === 'unknown' ||
    lower === 'salary not available' ||
    lower === 'none'
  ) {
    return 'Salary not available';
  }

  // Standardize duration labels: /yr -> / year, /mo -> / month
  let formatted = trimmed
    .replace(/\/yr\b/gi, '/ year')
    .replace(/\/year\b/gi, '/ year')
    .replace(/\/mo\b/gi, '/ month')
    .replace(/\/month\b/gi, '/ month');

  // Normalize spacing for Lakh (L) values: e.g. ₹8.5L – ₹18.0L / year -> ₹8.5 L – ₹18.0 L / year
  formatted = formatted.replace(/₹\s*(\d+(?:\.\d+)?)\s*L\b/gi, '₹$1 L');

  return formatted;
}
