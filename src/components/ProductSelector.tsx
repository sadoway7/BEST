import React, { useState, useMemo, useRef, useEffect } from 'react';

interface ProductSelectorProps {
  categories: { name: string; items: { name: string }[] }[];
  selectedProduct: string;
  onProductChange: (product: string) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  categories,
  selectedProduct,
  onProductChange,
}) => {
  const [searchValue, setSearchValue] = useState(selectedProduct);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten and filter items based on search
  const filteredItems = useMemo(() => {
    const searchLower = searchValue.toLowerCase();
    return categories
      .flatMap(category => category.items)
      .filter(item => item.name.toLowerCase().includes(searchLower))
      .slice(0, 10); // Limit to 10 results
  }, [categories, searchValue]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setHighlightedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
          const selectedItem = filteredItems[highlightedIndex];
          setSearchValue(selectedItem.name);
          onProductChange(selectedItem.name);
          setIsDropdownOpen(false);
          setHighlightedIndex(-1);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
      }
    };

    const handleItemClick = (itemName: string) => {
      setSearchValue(itemName);
      onProductChange(itemName);
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    };

    return (
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-2/5">
        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1.5">
          Product
        </label>
        <div className="relative mt-1" ref={dropdownRef}>
          <input
            id="product"
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setIsDropdownOpen(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            className="mt-1 block w-full pl-10 pr-4 py-2.5 text-base border border-primary-main bg-white text-gray-800 
                     focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-light
                     hover:border-primary-light transition-colors duration-200
                     sm:text-sm rounded-lg shadow-sm shadow-sm-blue"
            placeholder="Search products..."
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-1">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {isDropdownOpen && filteredItems.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-ui-border rounded-lg card-shadow max-h-60 overflow-auto">
              {filteredItems.map((item, index) => (
                <div
                  key={item.name}
                  onClick={() => handleItemClick(item.name)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150 ${
                    highlightedIndex === index
                      ? 'bg-primary-lighter text-primary-main'
                      : 'text-gray-800 hover:bg-gray-50'
                  }
                  ${index !== filteredItems.length - 1 ? 'border-b border-ui-border' : ''}`}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  export default ProductSelector;
