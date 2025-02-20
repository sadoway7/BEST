import React from 'react';
import { Product } from '../dataHandler';
import { Trash2, Plus, Minus } from 'lucide-react';

interface ShoppingListItem {
  product: string;
  weight: string;
  quantity: number;
  price: number;
}

interface ShoppingListProps {
  items: ShoppingListItem[];
  onRemoveItem: (index: number) => void;
  onQuantityChange: (index: number, newQuantity: number) => void;
  calculatePrice: (productName: string, weightSize: string, qty: number, products: Product[]) => number;
  products: Product[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ 
  items, 
  onRemoveItem, 
  onQuantityChange, 
  calculatePrice, 
  products 
}) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="overflow-x-auto scrollable">
      <table className="w-full text-gray-800 border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-ui-border">
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="text-left p-3 hidden sm:table-cell text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th className="text-center p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
            <th className="text-right p-3 hidden sm:table-cell text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
            <th className="text-right p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const unitPrice = calculatePrice(item.product, item.weight, item.quantity, products) / item.quantity;

            return (
              <tr 
                key={index} 
                className="border-b border-ui-border hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-3 font-medium">{item.product}</td>
                <td className="p-3 hidden sm:table-cell text-gray-600">{item.weight || 'Default'}</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onQuantityChange(index, Math.max(1, item.quantity - 1))}
                      className="p-1 rounded-full bg-gray-100 hover:bg-primary-lighter hover:text-primary-main 
                                 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-lighter"
                      aria-label="Decrease Quantity"
                    >
                      <Minus size={14} strokeWidth={2} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onQuantityChange(index, item.quantity + 1)}
                      className="p-1 rounded-full bg-gray-100 hover:bg-primary-lighter hover:text-primary-main 
                                 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-lighter"
                      aria-label="Increase Quantity"
                    >
                      <Plus size={14} strokeWidth={2} />
                    </button>
                  </div>
                </td>
                <td className="p-3 text-right hidden sm:table-cell text-gray-700">
                  ${unitPrice && typeof unitPrice === 'number' ? unitPrice.toFixed(2) : 'N/A'}
                </td>
                <td className="p-3 text-right font-semibold text-primary-main">
                  ${item.price && typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}
                </td>
                <td className="p-3">
                  <button 
                    onClick={() => onRemoveItem(index)} 
                    className="text-gray-500 hover:text-primary-main transition-colors duration-200
                               focus:outline-none focus:ring-2 focus:ring-primary-lighter rounded-full p-1"
                  >
                    <Trash2 size={18} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            );
          })}
          {items.length > 0 && (
            <tr className="bg-gray-50">
              <td 
                colSpan={4} 
                className="text-right p-3 font-semibold text-gray-800 text-lg"
              >
                Grand Total:
              </td>
              <td className="text-right p-3 font-bold text-primary-main text-xl">
                ${total.toFixed(2)}
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
      {items.length > 0 && (
        <p className="text-xs text-ui-text-secondary mt-2 text-center italic">
          Note: Prices do not include tax or additional fees.
        </p>
      )}
    </div>
  );
};

export default ShoppingList;
