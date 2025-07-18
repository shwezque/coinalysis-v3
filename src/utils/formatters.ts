export const formatCurrency = (value: number, decimals: number = 2): string => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  } else {
    return `$${value.toFixed(decimals)}`;
  }
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  } else {
    return value.toFixed(decimals);
  }
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return formatCurrency(price, 0);
  } else if (price >= 1) {
    return formatCurrency(price, 2);
  } else if (price >= 0.01) {
    return formatCurrency(price, 4);
  } else {
    return formatCurrency(price, 8);
  }
};

export const getPriceChangeColor = (change: number): string => {
  if (change > 0) return 'text-green-600 dark:text-green-400';
  if (change < 0) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
};

export const getPriceChangeIcon = (change: number): string => {
  if (change > 0) return '▲';
  if (change < 0) return '▼';
  return '';
};