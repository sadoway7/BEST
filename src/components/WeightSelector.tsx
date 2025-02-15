import React, { useEffect } from 'react';

interface WeightSelectorProps {
  pricing: any[];
  selectedWeight: string;
  onWeightChange: (weight: string) => void;
  hideSelect: boolean;
}

const WeightSelector: React.FC<WeightSelectorProps> = ({
  pricing,
  selectedWeight,
  onWeightChange,
  hideSelect
}) => {

  useEffect(() => {
    if (pricing.length > 0 && pricing[0]?.size && !selectedWeight) {
      onWeightChange(pricing[0].size);
    }
  }, [pricing, selectedWeight, onWeightChange]);

  if (hideSelect) {
    return null;
  }

  // Extract unique weight sizes using a Set
  const uniqueSizes = Array.from(new Set(pricing.map(priceOption => priceOption.size)));

  return (
    <div className="w-full sm:w-1/3">
      <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
        Size
      </label>
      <select
        id="weight"
        value={selectedWeight}
        onChange={(e) => onWeightChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-bg-light text-gray-800 focus:outline-none focus:ring-terracotta-light focus:border-terracotta-light sm:text-sm rounded-md hover:border-terracotta-main cursor-pointer"
      >
        <option value="">Select a size</option>
        {uniqueSizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WeightSelector;
