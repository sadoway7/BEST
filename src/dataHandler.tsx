import { dummyProducts } from './dummyData';

const USE_DUMMY_DATA = true; // Toggle this to switch between dummy and real data

export interface Product {
  category: string;
  item: string;
  size: string | null;
  price: number;
  quantity_min?: number;
  quantity_max?: number | null;
  discount?: number;
  prices?: { // Add optional prices property to Product interface
    [size: string]: number | undefined;
  };
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

export const getAllProducts = async (): Promise<Product[]> => {
  // Clear localStorage before fetching
  localStorage.clear();

  // Return dummy data if USE_DUMMY_DATA is true
  if (USE_DUMMY_DATA) {
    return dummyProducts;
  }

  try {
    const cacheBust = new Date().getTime();
    const response = await fetch(`/wp-json/cclist/v1/products?cb=${cacheBust}`);
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData && errorData.code && errorData.message) {
        throw new Error(`WordPress API error (${errorData.code}): ${errorData.message}`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    // Check for WordPress error structure even if response.ok is true
    if (Array.isArray(data) && data.length > 0 && data[0].code && data[0].message) {
      throw new Error(`WordPress API error (${data[0].code}): ${data[0].message}`);
    }

    // Convert prices to numbers in the fetched data
    data = data.map((product: Product) => { // Explicitly type product parameter as Product
      const parsedProduct: Product = { ...product, price: parseFloat(String(product.price)) };
      if (product.prices) {
        parsedProduct.prices = Object.keys(product.prices).reduce((acc: Record<string, number>, size) => { // Explicitly type acc in reduce
          const priceValue = product.prices?.[size]; // Safely access potentially undefined price
          acc[size] = priceValue !== undefined ? parseFloat(String(priceValue)) : 0; // Use 0 as default if undefined
          return acc;
        }, {} as Record<string, number>);
      } else {
        parsedProduct.prices = {}; // Ensure prices is always initialized, even if not in source data
      }
      return parsedProduct;
    });
    return data;
  } catch (error) {
    console.error("Error fetching product data from WordPress API:", error);
    return [];
  }
};

export const getGroupedProducts = (products: Product[]): GroupedProducts => {
  return products.reduce((acc: GroupedProducts, product: Product) => {
    const { category, size, price } = product; // Removed unused quantity_min and item from destructuring
    const sizeKey = size === null ? 'null' : size;

    if (!acc[category]) {
      acc[product.category] = {};
    }
    if (!acc[product.category][product.item]) {
      acc[product.category][product.item] = {
        item: product.item,
        prices: {},
      };
    }
    
    
    const lowestQuantityPrice = acc[product.category][product.item].prices[sizeKey]; // Changed to const - ESLint fix
    if (!lowestQuantityPrice || price < lowestQuantityPrice) { // Corrected logic: price < lowestQuantityPrice to find LOWEST price
        acc[product.category][product.item].prices[sizeKey] = price;
    }
    console.log('getGroupedProducts - groupedProducts:', acc); // ADDED LOGGING
    return acc;
  }, {});
};



export const getPrice = (productName: string, weightSize: string, qty: number, products: Product[]): number => {
  console.log('getPrice - Input parameters:', { productName, weightSize, qty, products }); // Log input parameters
  const pricingEntries = products.filter(
    (p) => p.item === productName && (p.size === weightSize || p.size === null)
  );

  if (pricingEntries.length === 0) {
    console.log('getPrice - No pricing entries found for:', { productName, weightSize }); // Log no pricing entries
    return 0;
  }

  const applicableEntry = pricingEntries.find(
    (p) =>
      qty >= (p.quantity_min ?? 1) &&
      (p.quantity_max === null || qty <= (p.quantity_max ?? Infinity))
  );

  if (!applicableEntry) return 0;

  // Convert price to a number using parseFloat
  const productPrice = applicableEntry.price;
  let price = productPrice * qty;

  if (isNaN(productPrice)) {
    console.error(`getPrice - Invalid price (not a number): ${applicableEntry?.price}`); // Use template literals for string conversion
    return 0; // Return 0 if price is not a valid number
  // const productPrice = parseFloat(applicableEntry.price); // Commenting out line 144
  }

  if (applicableEntry.discount) {
    price *= (1 - applicableEntry.discount);
  }
  console.log('getPrice - Calculated price:', price, 'applicableEntry:', applicableEntry); // Log calculated price
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

// --- Test script to run getAllProducts ---
// const testGetAllProducts = async () => {
//   try {
//     const products = await getAllProducts();
//     console.log("Products fetched from API:", products);
//   } catch (error) {
//     console.error("Error testing getAllProducts:", error);
//   }
// };

// testGetAllProducts();
// --- End test script ---