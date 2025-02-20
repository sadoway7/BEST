import React from 'react';
import { Product } from '../dataHandler';

interface PricePreviewProps {
  selectedProduct: string;
  selectedWeight: string;
  quantity: number;
  calculatePrice: (productName: string, weightSize: string, qty: number, products: Product[]) => number;
  products: Product[];
  children?: React.ReactNode;
}

const PricePreview: React.FC<PricePreviewProps> = ({
  selectedProduct,
  selectedWeight,
  quantity,
  calculatePrice,
  products,
  children,
}) => {
  const price = calculatePrice(selectedProduct, selectedWeight, quantity, products);

  return (
    <div className="mb-4 p-4 border border-ui-border rounded-lg bg-white card-shadow transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Price Preview</h3>
        {selectedProduct && (
          <span className="text-sm text-ui-text-secondary">
            Unit Price: {price > 0 ? `$${(price / quantity).toFixed(2)}` : '-'}
          </span>
        )}
      </div>
      
      {selectedProduct ? (
        <div className="overflow-x-auto">
          <table className="w-full text-gray-800 border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="p-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 transition-colors duration-200">
                <td className="p-3 font-medium">{selectedProduct}</td>
                <td className="p-3">{selectedWeight || 'Default'}</td>
                <td className="p-3 text-center">{quantity}</td>
                <td className="p-3 text-right font-semibold text-primary-main">
                  {price > 0 ? `$${price.toFixed(2)}` : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-ui-text-secondary italic text-center py-4">
          Select a product to see pricing details
        </p>
      )}
      
      <div className="flex justify-end mt-4 space-x-2">
        {children}
      </div>
    </div>
  );
};

export default PricePreview;
