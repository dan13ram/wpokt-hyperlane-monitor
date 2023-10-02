export const shortenHex = (hex: string, maxChars: number = 10): string => {
  if (!hex) return '';
  if (hex.length <= maxChars + 2) return hex;
  return `${hex.slice(0, maxChars - 4)}…${hex.slice(-4)}`;
};

export const uniqueValues = (array: string[]): string[] => {
  const map: Record<string, boolean> = {};
  array.forEach(item => {
    map[item] = true;
  });
  return Object.keys(map);
};

export const humanFormattedDate = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};
