import React, { useState, useMemo, useRef } from 'react';
import { Product } from '../dataHandler';
import { ChevronRight, ChevronDown, X, Search } from 'lucide-react';

interface CatalogProps {
  onClose: () => void;
  onPriceClick: (product: string, size: string | null) => void;
  products: Product[];
}

const MobCatalog: React.FC<CatalogProps> = ({ onClose, onPriceClick, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
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
    return Object.entries(grouped).reduce((acc: Record<string, Record<string, Product[]>>, [category, items]) => {
      acc[category] = Object.entries(items)
        .sort(([itemA], [itemB]) => itemA.localeCompare(itemB))
        .reduce((itemAcc: Record<string, Product[]>, [itemName, products]) => {
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
          .reduce((itemAcc: Record<string, Product[]>, [itemName, itemProducts]) => {
            itemAcc[itemName] = itemProducts;
            return itemAcc;
          }, {} as Record<string, Product[]>);

        if (Object.keys(filteredItems).length > 0) {
          acc[category] = filteredItems;
        }
        return acc;
      }, {} as Record<string, Record<string, Product[]>>);

    // Sort categories in filtered results
    const sortedFiltered = Object.entries(filtered)
      .sort(([catA], [catB]) => catA.localeCompare(catB))
      .reduce((acc, [category, items]) => {
        acc[category] = items;
        return acc;
      }, {} as Record<string, Record<string, Product[]>>);

    return sortedFiltered;
  }, [categorizedProducts, searchTerm]);

  const toggleItemExpansion = (itemName: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // Helper function to format price break display
  const formatPriceBreak = (product: Product) => {
    const minQty = product.quantity_min ?? 1;
    const maxQty = product.quantity_max ?? '+';
    return `${minQty}-${maxQty}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-8 flex flex-col max-h-[calc(100vh-4rem)] overflow-x-hidden">
        {/* Search and Categories */}
        <div className="p-4 border-b border-ui-border flex-shrink-0 relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
            <button 
              onClick={onClose} 
              className="bg-red-500 border border-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            >
              <X size={0} className="text-white" />
            </button>
          </div>
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={handleSearchChange}
              ref={searchInputRef}
              enterKeyHint="search"
              className="w-full pl-10 pr-4 py-2.5 text-base border border-primary-main bg-white text-gray-800 rounded-lg
                       shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-primary-light
                       focus:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-200
                       focus:outline-none focus:ring-2 focus:ring-primary-lighter focus:border-primary-main shadow-sm-blue"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </form>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white border border-primary-main hover:border-primary-light text-gray-700 py-2.5 px-4 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value === '' ? null : e.target.value)}
            >
              <option value="">Choose a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 flex flex-col min-h-full">
          <div className="flex justify-between items-center p-4 border-b border-ui-border flex-shrink-0">
            <h2 className="text-lg font-medium">
              {selectedCategory || 'All Products'}
            </h2>
          </div>

          <div className="overflow-y-auto flex-1 p-4">
            <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
              Click on a product to view sizes and prices. Select a variant to add it to your calculation.
            </div>

            {Object.entries(filteredProducts).map(([category, items]) => (
              <div key={category} className="mb-6 last:mb-0">
                {Object.entries(items).map(([itemName, variants]) => (
                  <div 
                    key={itemName} 
                    className="border border-ui-border rounded-lg overflow-hidden mb-2"
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
                        {variants.map((product: Product) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobCatalog;