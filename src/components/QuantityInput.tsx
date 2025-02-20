import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantityInputProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  quantity,
  onQuantityChange,
}) => {
  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    onQuantityChange(Math.max(1, quantity - 1));
  };

  return (
    <div className="w-full sm:w-1/3">
      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1.5">
        Quantity
      </label>
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={handleDecrement}
          className="absolute left-0 h-full px-3 flex items-center justify-center text-gray-500 
                   hover:text-primary-main transition-colors"
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            onQuantityChange(isNaN(value) ? 1 : Math.max(1, value));
          }}
          min="1"
          className="block w-full px-10 py-2.5 text-base border border-ui-border bg-white text-gray-800 
                   focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main 
                   hover:border-gray-400 transition-colors duration-200
                   sm:text-sm rounded-lg shadow-sm text-center appearance-none"
          placeholder="Enter quantity"
        />
        <button
          type="button"
          onClick={handleIncrement}
          className="absolute right-0 h-full px-3 flex items-center justify-center text-gray-500 
                   hover:text-primary-main transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuantityInput;
