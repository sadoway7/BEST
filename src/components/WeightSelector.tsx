import React, { useEffect } from 'react';
import { Product } from '../dataHandler';

interface WeightSelectorProps {
  pricing: Product[];
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
  const uniqueSizes = Array.from(new Set(pricing.map(priceOption => priceOption.size).filter(Boolean)));

  return (
    <div className="w-full sm:w-1/3">
      <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1.5">
        Size
      </label>
      <div className="relative mt-1">
        <select
          id="weight"
          value={selectedWeight}
          onChange={(e) => onWeightChange(e.target.value)}
          className="mt-1 block w-full pl-4 pr-10 py-2.5 text-base bg-white text-gray-800 rounded-lg font-semibold
                   shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)]
                   transition-shadow duration-200
                   focus:outline-none sm:text-sm appearance-none cursor-pointer"
        >
          <option value="" className="text-ui-text-secondary">
            Select a size
          </option>
          {uniqueSizes.map((size) => (
            <option key={size} value={size || ''} className="text-gray-800">
              {size || 'Default'}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 mt-1 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WeightSelector;
