import React from 'react';

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
  return (
    <div className="w-full sm:w-1/3">
      <label htmlFor="product" className="block text-sm font-medium text-gray-700">
        Product
      </label>
      <select
        id="product"
        value={selectedProduct}
        onChange={(e) => onProductChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-bg-light text-gray-800 focus:outline-none focus:ring-terracotta-light focus:border-terracotta-light sm:text-sm rounded-md hover:border-terracotta-main cursor-pointer"
      >
        <option value="">Select a product</option>
        {categories.map((category) => (
          <optgroup key={category.name} label={category.name} className="text-gray-800 bg-bg-light">
            {category.items.map((item) => (
              <option key={item.name} value={item.name} className="text-gray-800 bg-bg-light">
                {item.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export default ProductSelector;
