import React from 'react';

interface QuantityInputProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  quantity,
  onQuantityChange,
}) => {
  return (
    <div className="w-full sm:w-1/3">
      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1.5">
        Quantity
      </label>
      <div className="relative">
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            onQuantityChange(isNaN(value) ? 1 : Math.max(1, value));
          }}
          min="1"
          className="mt-1 block w-full pl-4 pr-10 py-2.5 text-base border border-ui-border bg-white text-gray-800 
                   focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main 
                   hover:border-gray-400 transition-colors duration-200
                   sm:text-sm rounded-lg shadow-sm"
          placeholder="Enter quantity"
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-3 mt-1 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default QuantityInput;
