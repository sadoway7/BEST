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
          className="no-spinners block w-full px-10 py-2.5 text-base bg-white text-gray-800 rounded-lg font-semibold
                   shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)]
                   focus:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-shadow duration-200
                     sm:text-sm text-center"
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
