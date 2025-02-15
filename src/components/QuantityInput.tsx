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
      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
        Quantity
      </label>
      <input
        type="number"
        id="quantity"
        value={quantity}
        onChange={(e) => onQuantityChange(parseInt(e.target.value, 10))}
        min="1"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-bg-light text-gray-800 focus:outline-none focus:ring-terracotta-light focus:border-terracotta-light sm:text-sm rounded-md hover:border-terracotta-main"
        placeholder="Enter quantity"
      />
    </div>
  );
};

export default QuantityInput;
