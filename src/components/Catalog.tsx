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
                className="w-full pl-10 pr-4 py-2.5 text-base border border-primary-main bg-white text-gray-800 rounded-lg
                         shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-primary-light
                         focus:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-200
                         focus:outline-none focus:ring-2 focus:ring-primary-lighter focus:border-primary-main shadow-sm-blue"
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
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
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
                      className="border border-ui-border rounded-lg overflow-hidden"
                    >
                      <div 
                        onClick={() => toggleItemExpansion(itemName)}
                        className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50"
                      >
                        <span className="text-[0.92em] font-medium text-gray-900">{itemName}</span>
                        {expandedItems[itemName] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </div>

                      {expandedItems[itemName] && (
                        <div className="border-t border-ui-border divide-y divide-ui-border">
                          {variants.map((product) => (
                            <div 
                              key={`${product.size || 'default'}`}
                              onClick={() => {
                                onPriceClick(itemName, product.size);
                                onClose();
                              }}
                              className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <div className="flex-1">
                                <div className="text-gray-800">
                                  {product.size || 'Standard'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-primary-main">
                                  ${product.price.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatPriceBreak(product)}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
