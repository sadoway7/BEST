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
  calculatePrice: (productName: string, weightSize: string, qty: number, products: Product[]) => number; // Renamed to calculatePrice and expects products
  products: Product[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemoveItem, onQuantityChange, calculatePrice, products }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="overflow-x-auto scrollable">
      <table className="w-full text-gray-800">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left p-2">Product</th>
            <th className="text-left p-2 hidden sm:table-cell">Size</th>
            <th className="text-center p-2">Qty</th>
            <th className="text-right p-2 hidden sm:table-cell">Unit Price</th>
            <th className="text-right p-2">Price</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            // Calculate the *correct* unit price using calculatePrice, passing products
            const unitPrice = calculatePrice(item.product, item.weight, item.quantity, products) / item.quantity;

            return (
              <tr key={index} className="border-b border-gray-300">
                <td className="p-2">{item.product}</td>
                <td className="p-2 hidden sm:table-cell">{item.weight}</td>
                <td className="p-2 text-center">
                  <div className="flex items-center justify-center">
                      <button
                      onClick={() => onQuantityChange(index, Math.max(1, item.quantity - 1))}
                      className="px-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                      aria-label="Decrease Quantity"
                      >
                      <Minus size={10} />
                      </button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <button
                      onClick={() => onQuantityChange(index, item.quantity + 1)}
                      className="px-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                      aria-label="Increase Quantity"

                      >
                      <Plus size={10} />
                      </button>
                  </div>
                </td>
                <td className="p-2 text-right hidden sm:table-cell">${unitPrice.toFixed(2)}</td>
                <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                <td className="p-2">
                  <button onClick={() => onRemoveItem(index)} className="text-terracotta-main hover:text-terracotta-light">
                    <Trash2 size={18}  />
                  </button>
                </td>
              </tr>
            );
          })}
          {items.length > 0 && (
            <tr className="font-bold text-gray-900">
              {/* Small screens (hide "Size" and "Unit Price") */}
              <td colSpan={2} className="text-right p-2 sm:hidden">
                Grand Total:
              </td>
              {/* Medium and larger screens (show all columns) */}
              <td colSpan={3} className="text-right p-2 hidden sm:table-cell">
                Grand Total:
              </td>
              <td className="text-right p-2">${total.toFixed(2)}</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Note about taxes */}
      {items.length > 0 && (
        <p className="text-xs text-gray-700 mt-2">Note: Prices do not include tax.</p>
      )}
    </div>
  );
};

export default ShoppingList;
