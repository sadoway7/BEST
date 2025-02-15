import React, { useState } from 'react';

import { Product } from '../dataHandler';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CatalogProps {
  onClose: () => void;
  onPriceClick: (product: string, size: string | null) => void;
  products: Product[];
}


interface GroupedProducts {
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
// Removed because it's now in dataHandler.tsx
// function parseSize(sizeString: string | null): number {
//   if (!sizeString) {
//     return 0;
//   }

//   const match = sizeString.match(/^(\d+(\.\d+)?)\s*([a-zA-Z]+)?$/);
//   if (!match) {
//     return 0;
//   }

//   const value = parseFloat(match[1]);
//   const unit = match[3] ? match[3].toLowerCase() : '';

//   // Conversion factors (use consistent base units)
//   const gramConversions: { [key: string]: number } = {
//     g: 1,
//     gm: 1,
//     kg: 1000,
//     lbs: 453.592,
//     lb: 453.592,
//     '50lb': 50 * 453.592, // Handle special case
//     '50lbs': 50 * 453.592,
//   };
//   const mlConversions: { [key: string]: number } = {
//     ml: 1,
//     l: 1000,
//     litre: 1000,
//     liter: 1000,
//     litres: 1000,
//     liters: 1000,
//     oz: 29.5735,
//     pint: 473.176,
//     gallon: 3785.41,
//   };

//   if (gramConversions[unit]) {
//     return value * gramConversions[unit];
//   } else if (mlConversions[unit]) {
//     return value * mlConversions[unit];
//   }

//   console.warn(`Unknown unit: ${unit}`);
//   return value;
// }

const Catalog: React.FC<CatalogProps> = ({ onClose, onPriceClick, products }) => {
  console.log('Catalog - Component Rendered'); // Log when Catalog component renders
  console.log('Catalog - products prop:', products); // Log products prop

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    Object.keys(products.reduce((acc: Record<string, boolean>, product: Product) => { // use products prop
      acc[product.category] = false;
      return acc;
    }, {})).forEach(category => {
      initialState[category] = false;
    });
    return initialState;
  });

  const toggleSection = (category: string) => {
    console.log('Catalog - toggleSection called for category:', category); // Log toggleSection call
    setCollapsedSections(prevState => {
      console.log('Catalog - Previous collapsedSections:', prevState); // Log previous collapsedSections
      const newState = ({
        ...prevState,
        [category]: !prevState[category],
      });
      console.log('Catalog - New collapsedSections:', newState); // Log new collapsedSections
      return newState;
    });
  };

  const groupedProducts: GroupedProducts = products.reduce((acc: GroupedProducts, product: Product) => { // use products prop
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

  console.log('Catalog - groupedProducts:', groupedProducts); // Log groupedProducts
  console.log('Catalog - collapsedSections:', collapsedSections); // Log collapsedSections

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
      <div className="bg-bg-light p-4 rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-bold text-claybrown-main mb-4">Product Catalog</h2>
        <button onClick={onClose} className="absolute top-2 right-2 px-4 py-2 bg-terracotta-main text-white rounded hover:bg-terracotta-light">Close</button>
        {Object.entries(groupedProducts).map(([category, products]) => { // Loop for each category
          console.log('Catalog - Rendering category:', category); // Log category being rendered (again, for emphasis)
          console.log('Catalog - collapsedSections[category]:', collapsedSections[category]); // Log collapsedSections state for this category
          return (
            <div key={category} className="mb-4">
              <div
                className="flex items-center justify-between bg-warmbeige-light text-black p-2  cursor-pointer"
                onClick={() => toggleSection(category)}
              >
                <h3 className="font-bold">{category}</h3>
                {collapsedSections[category] ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
              </div>
              {!collapsedSections[category] && ( // Conditional rendering for expanded section
                (() => {
                  console.log('Catalog - Category expanded:', category); // Log when category is expanded
                  console.log('Catalog - Items in expanded category:', products); // Log items in expanded category
                  return (
                    <ul className="mt-2">
                      {Object.entries(products).map(([itemName, product]) => { // Loop for each item in category
                        console.log('Catalog - Rendering item:', itemName, 'product:', product); // Log itemName and product
                        console.log('Catalog - Item - product.item:', product.item, 'product.prices:', product.prices); // NEW LOG: Log product.item and product.prices
                        return (
                          <li key={itemName} className="py-1">
                            <span className="">{product.item}:</span>
                            {Object.entries(product.prices).map(([size, price]) => (
                              <button
                                key={size}
                                className="ml-2 px-3 py-1 bg-bg-light  hover:bg-warmbeige-light text-black"
                                onClick={() => {
                                  onPriceClick(product.item, size === 'null' ? null : size);
                                  onClose();
                                }}
                              >
                                {size === 'null' ? 'Price' : size}: ${(() => {
                                  console.log('Catalog - Rendering price button - size:', size, 'price:', price); // Log size and price before toFixed
                                  return `${price?.toFixed(2) ?? 'N/A'}`;
                                })()}
                              </button>
                            ))}
                          </li>
                        );
                      })}
                    </ul>
                  );
                })()
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Catalog;
