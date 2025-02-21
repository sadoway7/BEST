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
            className="mt-1 block w-full pl-10 pr-4 py-2.5 text-base bg-white text-gray-900 rounded-lg font-semibold
                     shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)]
                     transition-shadow duration-200 focus:outline-none"
            placeholder="Search"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-1">
            <svg className="h-5 w-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 2 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {isDropdownOpen && filteredItems.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-md max-h-60 overflow-auto">
              {filteredItems.map((item, index) => (
                <div
                  key={item.name}
                  onClick={() => handleItemClick(item.name)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-3 cursor-pointer text-base transition-colors duration-150 ${
                    highlightedIndex === index
                      ? 'bg-gray-200 font-bold text-gray-900'
                      : 'hover:bg-gray-100 font-semibold text-gray-800'
                  }`}
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

