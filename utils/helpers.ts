export const shortenHex = (hex: string): string => {
  if (!hex) return '';
  return `${hex.slice(0, 6)}...${hex.slice(-4)}`;
};
