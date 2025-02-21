import React, { useState, useMemo } from 'react';
import { Product } from '../dataHandler';
import { ChevronRight, ChevronDown, X, Search } from 'lucide-react';

interface CatalogProps {
  onClose: () => void;
  onPriceClick: (product: string, size: string | null) => void;
  products: Product[];
}

const Catalog: React.FC<CatalogProps> = ({ onClose, onPriceClick, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Group and sort products by category
  const categorizedProducts = useMemo(() => {
    const grouped = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = {};
      }
      if (!acc[product.category][product.item]) {
        acc[product.category][product.item] = [];
      }
      acc[product.category][product.item].push(product);
      return acc;
    }, {} as Record<string, Record<string, Product[]>>);

    // Sort items within each category
    return Object.entries(grouped).reduce((acc, [category, items]) => {
      acc[category] = Object.entries(items)
        .sort(([itemA], [itemB]) => itemA.localeCompare(itemB))
        .reduce((itemAcc, [itemName, products]) => {
          itemAcc[itemName] = products;
          return itemAcc;
        }, {} as Record<string, Product[]>);
      return acc;
    }, {} as Record<string, Record<string, Product[]>>);
  }, [products]);

  // Get sorted categories
  const categories = useMemo(() => 
    Object.keys(categorizedProducts).sort(), 
    [categorizedProducts]
  );

  // Filter and sort products based on search
  const filteredProducts = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    
    // Reset category selection when searching
    if (searchTerm) {
      setSelectedCategory(null);
    }

    const filtered = Object.entries(categorizedProducts)
      .filter(([category]) => !selectedCategory || category === selectedCategory)
      .reduce((acc, [category, items]) => {
        const filteredItems = Object.entries(items)
          .filter(([itemName, variants]) => 
            itemName.toLowerCase().includes(searchLower) ||
            variants.some(variant => 
              (variant.size?.toLowerCase().includes(searchLower)) ||
              variant.price.toString().includes(searchLower)
            )
          )
          .sort(([itemA], [itemB]) => itemA.localeCompare(itemB))
          .reduce((itemAcc, [itemName, itemProducts]) => {
            itemAcc[itemName] = itemProducts;
            return itemAcc;
          }, {} as Record<string, Product[]>);

        if (Object.keys(filteredItems).length > 0) {
          acc[category] = filteredItems;
        }
        return acc;
      }, {} as Record<string, Record<string, Product[]>>);

    // Sort categories in filtered results
    return Object.entries(filtered)
      .sort(([catA], [catB]) => catA.localeCompare(catB))
      .reduce((acc, [category, items]) => {
        acc[category] = items;
        return acc;
      }, {} as Record<string, Record<string, Product[]>>);
  }, [categorizedProducts, searchTerm, selectedCategory]);

  const toggleItemExpansion = (itemName: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  // Helper function to format price break display
  const formatPriceBreak = (product: Product) => {
    const minQty = product.quantity_min ?? 1;
    const maxQty = product.quantity_max ?? '+';
    return `${minQty}-${maxQty}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl my-8 flex max-h-[calc(100vh-4rem)]">
        {/* Side Categories */}
        <div className="w-64 border-r border-ui-border flex flex-col min-h-full">
          <div className="p-4 border-b border-ui-border flex-shrink-0">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-base bg-white text-gray-800 rounded-lg font-semibold
                         shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)]
                         focus:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-shadow duration-200
                         focus:outline-none"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {categories.map(category => (
              <div 
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`px-4 py-2 cursor-pointer ${
                  selectedCategory === category 
                    ? 'bg-primary-lighter text-primary-main font-medium' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {category}
              </div>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 flex flex-col min-h-full">
          <div className="flex justify-between items-center p-4 border-b border-ui-border flex-shrink-0">
            <h2 className="text-lg font-medium">
              {selectedCategory || 'All Products'}
            </h2>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:scale-110 p-2 shadow-md hover:shadow-lg"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-4">
            <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
              Click on a product to view sizes and prices. Select a variant to add it to your calculation.
            </div>

            {Object.entries(filteredProducts).map(([category, items]) => (
              <div key={category} className="mb-6 last:mb-0">
                {!selectedCategory && (
                  <div className="mb-3 inline-block">
                    <h3 className="text-sm font-medium text-gray-700 border border-gray-900 rounded-lg px-3 py-1">
                      {category}
                    </h3>
                  </div>
                )}
                <div className="space-y-2">
                  {Object.entries(items).map(([itemName, variants]) => (
                    <div 
                      key={itemName}
                      className="rounded-lg overflow-hidden mb-2 shadow-md"
                    >
                      <div
                        onClick={() => toggleItemExpansion(itemName)}
                        className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition-colors bg-gray-200"
                      >
                        <span className="text-lg font-bold text-gray-900">{itemName}</span>
                        {expandedItems[itemName] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </div>

                      {expandedItems[itemName] && (
                        <div className="divide-y divide-gray-300 bg-white">
                          {(() => {
                            const uniqueSizes = new Map<string, Product[]>();
                            variants.forEach(product => {
                              const sizeKey = product.size || 'Standard';
                              if (!uniqueSizes.has(sizeKey)) {
                                uniqueSizes.set(sizeKey, []);
                              }
                              uniqueSizes.get(sizeKey)!.push(product);
                            });

                            return Array.from(uniqueSizes.entries()).map(([size, sizeVariants]) => {
                              const sortedVariants = sizeVariants.sort((a, b) => a.price - b.price);
                              return (
                                <div
                                  key={size}
                                  onClick={() => {
                                    onPriceClick(itemName, size);
                                    onClose();
                                  }}
                                  className="px-4 py-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer transition-colors"
                                >
                                  <div className="flex-1 flex items-center">
                                    <div className="text-base font-semibold text-gray-800 mr-4">
                                      {size}
                                    </div>
                                    <div className="text-right flex-grow grid grid-flow-col gap-8 justify-end">
                                      {sortedVariants.map((product, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                          <div className="text-lg text-black font-bold">
                                            ${product.price.toFixed(2)}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {formatPriceBreak(product)}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
