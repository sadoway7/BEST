import React, { useState } from 'react';
import { Product } from '../dataHandler';
import { ChevronDown, ChevronRight, X } from 'lucide-react';

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
    setCollapsedSections(prevState => ({
      ...prevState,
      [category]: !prevState[category],
    }));
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 
                    animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-ui-border">
          <h2 className="text-2xl font-semibold text-gray-800">Product Catalog</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-primary-lighter"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {Object.entries(groupedProducts).map(([category, products]) => (
            <div key={category} className="mb-6 rounded-lg border border-ui-border overflow-hidden">
              <div
                className="flex items-center justify-between bg-gray-50 p-4 cursor-pointer
                         hover:bg-gray-100 transition-colors duration-200"
                onClick={() => toggleSection(category)}
              >
                <h3 className="text-lg font-medium text-gray-800">{category}</h3>
                <div className="text-gray-500 transition-transform duration-200">
                  {collapsedSections[category] ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {!collapsedSections[category] && (
                <div className="divide-y divide-ui-border">
                  {Object.entries(products).map(([itemName, product]) => (
                    <div key={itemName} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="font-medium text-gray-800">{product.item}</span>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {Object.entries(product.prices).map(([size, price]) => (
                            <div key={size} className="flex flex-col items-center">
                              <button
                                className="px-4 py-2 bg-primary-lighter text-primary-main font-medium rounded-lg
                                         hover:bg-primary-main hover:text-white transition-colors duration-200
                                         focus:outline-none focus:ring-2 focus:ring-primary-lighter"
                                onClick={() => {
                                  onPriceClick(product.item, size === 'null' ? null : size);
                                  onClose();
                                }}
                              >
                                ${price?.toFixed(2) ?? 'N/A'}
                              </button>
                              <span className="text-xs text-ui-text-secondary mt-1">
                                {size === 'null' ? 'Default' : size}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
