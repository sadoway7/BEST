import productData from './products.json';

export interface Product {
  category: string;
  item: string;
  size: string | null;
  price: number;
  quantity_min?: number;
  quantity_max?: number | null;
  discount?: number;
}

export interface GroupedProducts {
  [category: string]: {
    [item: string]: {
      item: string;
      prices: {
        [size: string]: number | undefined;
      };
    };
  };
}

// Function to parse and normalize sizes. It converts size strings (e.g., "10g", "2 kg") into a normalized numeric value (in grams or milliliters).
export const parseSize = (sizeString: string | null): number => {
  if (!sizeString) {
    return 0;
  }

  const match = sizeString.match(/^(\d+(\.\d+)?)\s*([a-zA-Z]+)?$/);
  if (!match) {
    return 0;
  }

  const value = parseFloat(match[1]);
  const unit = match[3] ? match[3].toLowerCase() : '';

  // Conversion factors (use consistent base units)
  const gramConversions: { [key: string]: number } = {
    g: 1,
    gm: 1,
    kg: 1000,
    lbs: 453.592,
    lb: 453.592,
    '50lb': 50 * 453.592, // Handle special case
    '50lbs': 50 * 453.592,
  };
  const mlConversions: { [key: string]: number } = {
    ml: 1,
    l: 1000,
    litre: 1000,
    liter: 1000,
    litres: 1000,
    liters: 1000,
    oz: 29.5735,
    pint: 473.176,
    gallon: 3785.41,
  };

  if (gramConversions[unit]) {
    return value * gramConversions[unit];
  } else if (mlConversions[unit]) {
    return value * mlConversions[unit];
  } else {
    // Handle unknown units, maybe log a warning, and return the value as is
    console.warn(`Unknown unit: ${unit}`);
    return value; // Return the numeric part as a fallback
  }
}

export const getAllProducts = (): Product[] => {
  return productData;
};

export const getGroupedProducts = (products: Product[]): GroupedProducts => {
  return products.reduce((acc: GroupedProducts, product: Product) => {
    if (!acc[product.category]) {
      acc[product.category] = {};
    }
    if (!acc[product.category][product.item]) {
      acc[product.category][product.item] = {
        item: product.item,
        prices: {},
      };
    }

    const sizeKey = product.size === null ? 'null' : product.size;
    acc[product.category][product.item].prices[sizeKey] = product.price;

    return acc;
  }, {});
};

export const getPrice = (productName: string, weightSize: string, qty: number, products: Product[]): number => {
  const pricingEntries = products.filter(
    (p) => p.item === productName && (p.size === weightSize || p.size === null)
  );

  if (pricingEntries.length === 0) return 0;

  const applicableEntry = pricingEntries.find(
    (p) =>
      qty >= (p.quantity_min ?? 1) &&
      (p.quantity_max === null || qty <= (p.quantity_max ?? Infinity))
  );

  if (!applicableEntry) return 0;

  let price = applicableEntry.price * qty;
  if (applicableEntry.discount) {
    price *= (1 - applicableEntry.discount);
  }
  return price;
};

export const getCategories = (products: Product[]): { name: string; items: { name: string }[] }[] => {
  const categoryMap = new Map();
  products.forEach(product => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, { name: product.category, items: [] });
    }
    if (!categoryMap.get(product.category).items.some((item: { name: string }) => item.name === product.item)) {
      categoryMap.get(product.category).items.push({ name: product.item });
    }
  });
  return Array.from(categoryMap.values());
};