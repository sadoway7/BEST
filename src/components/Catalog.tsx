import React, { useState } from 'react';
import productData from '../products.json';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CatalogProps {
  onClose: () => void;
  onPriceClick: (product: string, size: string | null) => void; // Add onPriceClick prop
}

// Function to parse and normalize sizes
function parseSize(sizeString: string): number {
  if (!sizeString) {
    return 0;
  }

  const match = sizeString.match(/^(\d+(\.\d+)?)\s*([a-zA-Z]+)?$/);
  if (!match) {
    return 0; // Handle cases where the format is unexpected
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
    oz: 29.5735, // Fluid ounces - CORRECTED VALUE
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

const Catalog: React.FC<CatalogProps> = ({ onClose, onPriceClick }) => {
  // Group by Category and Item
  const groupedProducts = productData.reduce((acc: any, product) => {
    if (!acc[product.category]) {
      acc[product.category] = {};
    }
    if (!acc[product.category][product.item]) {
      acc[product.category][product.item] = {
        item: product.item,
        prices: {},
      };
    }
    // Store all prices, including null size
    if (product.size === null) {
      acc[product.category][product.item].prices['null'] = product.price;
    } else {
      acc[product.category][product.item].prices[product.size] = product.price;
    }

    return acc;
  }, {});

  const [collapsedSections, setCollapsedSections] = useState(() => {
    const initialState: { [key: string]: boolean } = {};
    Object.keys(groupedProducts).forEach(category => {
      initialState[category] = true; // Initially collapse all sections
    });
    return initialState;
  });

  const toggleSection = (category: string) => {
    setCollapsedSections(prevState => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  // Calculate the maximum number of sizes + item + potential null price
  const maxColumns =
    1 + // For the "Item" column
    Math.max(
      ...Object.values(groupedProducts).map((items: any) => {
        return Object.values(items).reduce((max: number, itemData: any) => {
          const sizesCount = Object.keys(itemData.prices).filter(key => key !== 'null').length;
          return Math.max(max, sizesCount);
        }, 0);
      })
    ) +
    1; // +1 to account for the potential "Price" column (null size)

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto pt-10 pb-10 scrollable">
      <div className="bg-bg-light p-4 sm:p-6 rounded-lg shadow-xl w-full sm:max-w-lg md:max-w-xl lg:max-w-5xl xl:max-w-7xl border border-gray-200 relative">
        <h2 className="text-2xl font-bold text-claybrown-main">Product Catalog</h2>
        <p className="text-sm text-gray-700 mb-4">Click a price to make a selection.</p>

        {/* Close Button - Fixed Positioning */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-terracotta-main hover:bg-terracotta-light text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>

        <div>
          {Object.entries(groupedProducts).map(([category, items]: [string, any]) => {
            const categorySizes = Array.from(
              new Set(
                productData
                  .filter((product) => product.category === category)
                  .map((product) => product.size)
                  .filter(Boolean)
              )
            ).sort((a, b) => {
                // Use the parseSize function for comparison
                return parseSize(a) - parseSize(b);
            });

            const hasNullSize = productData.some(
              (product) => product.category === category && product.size === null
            );

            return (
              <div key={category} className="mb-4 overflow-x-auto">
                <table className="w-full text-gray-800">
                  <tbody>
                    {/* Category Row */}
                    <tr className="bg-warmbeige-main text-white cursor-pointer w-full" onClick={() => toggleSection(category)}>
                      <td colSpan={maxColumns} className="px-2 py-1 sm:px-4 sm:py-2 text-left font-bold min-w-fit whitespace-nowrap">
                        {collapsedSections[category] ? (
                          <ChevronRight size={16} className="inline-block mr-1" />
                        ) : (
                          <ChevronDown size={16} className="inline-block mr-1" />
                        )}
                        {category}
                      </td>
                    </tr>

                    {/* Header Row and Item Rows (only if expanded) */}
                    {!collapsedSections[category] && (
                      <>
                        <tr className="bg-warmbeige-light text-gray-800">
                          <th className="px-2 py-1 sm:px-4 sm:py-2 text-left min-w-[200px] w-full">Item</th>
                          {categorySizes.map((size) => (
                            <th key={size} className="px-2 py-1 sm:px-4 sm:py-2 text-center w-auto">{size}</th>
                          ))}
                          {hasNullSize && <th className="px-2 py-1 sm:px-4 sm:py-2 text-center w-auto">Price</th>}
                        </tr>
                        {Object.values(items).map((itemData: any) => (
                          <tr key={itemData.item} className="border-b border-gray-300">
                            <td className="px-2 py-1 sm:px-4 sm:py-2 text-left break-words min-w-[200px] w-full">{itemData.item}</td>
                            {categorySizes.map((size) => (
                              <td
                                key={`${itemData.item}-${size}`}
                                className="px-2 py-1 sm:px-4 sm:py-2 text-center break-words w-auto cursor-pointer"
                                onClick={() => { onPriceClick(itemData.item, size); onClose(); }}
                              >
                                {itemData.prices[size] !== undefined
                                  ? `$${itemData.prices[size].toFixed(2)}`
                                  : '-'}
                              </td>
                            ))}
                            {hasNullSize && (
                              <td
                                className="px-2 py-1 sm:px-4 sm:py-2 text-center break-words w-auto cursor-pointer"
                                onClick={() => { onPriceClick(itemData.item, null); onClose(); }}
                              >
                                {itemData.prices['null'] !== undefined
                                  ? `$${itemData.prices['null'].toFixed(2)}`
                                  : '-'}
                              </td>
                            )}
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
