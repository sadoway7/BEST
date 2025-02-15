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

const Catalog: React.FC<CatalogProps> = ({ onClose, onPriceClick, products }) => {
  console.log('Catalog - Component Rendered');
  console.log('Catalog - products prop:', products);

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    Object.keys(products.reduce((acc: Record<string, boolean>, product: Product) => {
      acc[product.category] = false;
      return acc;
    }, {})).forEach(category => {
      initialState[category] = false;
    });
    return initialState;
  });

  const toggleSection = (category: string) => {
    console.log('Catalog - toggleSection called for category:', category);
    setCollapsedSections(prevState => {
      console.log('Catalog - Previous collapsedSections:', prevState);
      const newState = ({
        ...prevState,
        [category]: !prevState[category],
      });
      console.log('Catalog - New collapsedSections:', newState);
      return newState;
    });
  };

  const groupedProducts: GroupedProducts = products.reduce((acc: GroupedProducts, product: Product) => {
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

  console.log('Catalog - groupedProducts:', groupedProducts);
  console.log('Catalog - collapsedSections:', collapsedSections);

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
      <div className="bg-bg-light p-4 rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-bold text-claybrown-main mb-4">Product Catalog</h2>
        <button onClick={onClose} className="absolute top-2 right-2 px-4 py-2 bg-terracotta-main text-white rounded hover:bg-terracotta-light">Close</button>
        {Object.entries(groupedProducts).map(([category, products]) => {
          console.log('Catalog - Rendering category:', category);
          console.log('Catalog - collapsedSections[category]:', collapsedSections[category]);
          return (
            <div key={category} className="mb-4">
              <div
                className="flex items-center justify-between bg-warmbeige-light text-black p-2  cursor-pointer"
                onClick={() => toggleSection(category)}
              >
                <h3 className="font-bold">{category}</h3>
                {collapsedSections[category] ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
              </div>
              {!collapsedSections[category] && (
                (() => {
                  console.log('Catalog - Category expanded:', category);
                  console.log('Catalog - Items in expanded category:', products);
                  return (
                    <ul className="mt-2">
                      {Object.entries(products).map(([itemName, product]) => {
                        return (
                          <li key={itemName} className="py-2 border-b border-gray-200">
                            <div className="flex justify-between items-center py-1">
                              <span className=" ">{product.item}</span>
                              <div className="flex space-x-4">
                                {Object.entries(product.prices).map(([size, price]) => (
                                  <button
                                    key={size}
                                    className="px-4 py-2 bg-bg-light hover:bg-warmbeige-light text-black text-sm"
                                    onClick={() => {
                                      onPriceClick(product.item, size === 'null' ? null : size);
                                      onClose();
                                    }}
                                  >
                                    ${(() => `${price?.toFixed(2) ?? 'N/A'}`)()}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-end space-x-4 mt-0.5">
                              {Object.keys(product.prices).map((size) => (
                                <span key={size} className="text-xs text-gray-500">{size === 'null' ? 'Price' : size}</span>
                              ))}
                            </div>
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
