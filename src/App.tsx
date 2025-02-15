import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import ProductSelector from './components/ProductSelector';
import WeightSelector from './components/WeightSelector';
import QuantityInput from './components/QuantityInput';
import AddItemButton from './components/AddItemButton';
import ShoppingList from './components/ShoppingList';
import productData from './products.json';
import PricePreview from './components/PricePreview';
import Catalog from './components/Catalog';

const App = () => {
  const [items, setItems] = useState<{ product: string; weight: string; quantity: number; price: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showCatalog, setShowCatalog] = useState(false);

  const categories = useMemo(() => {
    const categoryMap = new Map();
    productData.forEach(product => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, { name: product.category, items: [] });
      }
      if (!categoryMap.get(product.category).items.some((item: any) => item.name === product.item)) {
        categoryMap.get(product.category).items.push({ name: product.item });
      }
    });
    return Array.from(categoryMap.values());
  }, []);

  const selectedProductPricing = useMemo(() => {
    return productData.filter(p => p.item === selectedProduct);
  }, [selectedProduct]);

  const getPrice = (productName: string, weightSize: string, qty: number): number => {
    const pricingEntries = productData.filter(
      (p) => p.item === productName && (p.size === weightSize || p.size === null)
    );

    if (pricingEntries.length === 0) return 0;

    const applicableEntry = pricingEntries.find(
      (p) =>
        qty >= p.quantity_min &&
        (p.quantity_max === null || qty <= p.quantity_max)
    );

    if (!applicableEntry) return 0;

    let price = applicableEntry.price * qty;
    if (applicableEntry.discount) {
      price *= (1 - applicableEntry.discount);
    }
    return price;
  };

  const addItem = () => {
    if (!selectedProduct) return;

    const price = getPrice(selectedProduct, selectedWeight, quantity);
    setItems([
      ...items,
      {
        product: selectedProduct,
        weight: selectedWeight,
        quantity,
        price,
      },
    ]);
    setSelectedProduct('');
    setSelectedWeight('');
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handlePriceClick = (product: string, size: string | null) => {
    setSelectedProduct(product);
    setSelectedWeight(size || ''); // Set to empty string if size is null
    setQuantity(1); // Reset quantity to 1
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: newQuantity,
        price: getPrice(updatedItems[index].product, updatedItems[index].weight, newQuantity)
      };
      return updatedItems;
    });
  };

  return (
    <div className="bg-bg-main py-6 flex flex-col items-start sm:py-12 px-2 pt-6">
      <h1 className="text-3xl font-bold text-center w-full mb-4 text-claybrown-main">Ceramics Canada Price Calculator</h1>
      <div className="relative py-3 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl w-full mx-auto">
        <Card className="w-full bg-bg-light border-gray-200 shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-claybrown-main">Product Selector</CardTitle>
              <button
                onClick={() => setShowCatalog(true)}
                className="bg-terracotta-main hover:bg-terracotta-light text-white font-bold py-2 px-4 rounded"
              >
                Select from Catalog
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <ProductSelector
                categories={categories}
                selectedProduct={selectedProduct}
                onProductChange={setSelectedProduct}
              />
              <WeightSelector
                pricing={selectedProductPricing}
                selectedWeight={selectedWeight}
                onWeightChange={setSelectedWeight}
                hideSelect={selectedProductPricing.length > 0 && !selectedProductPricing[0].size}
              />
              <QuantityInput
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
            </div>

            <PricePreview
              selectedProduct={selectedProduct}
              selectedWeight={selectedWeight}
              quantity={quantity}
              getPrice={getPrice}
            >
                <AddItemButton onClick={addItem} />
            </PricePreview>
          </CardContent>
        </Card>

        {/* Shopping List Container */}
        <Card className="w-full bg-bg-light border-gray-200 shadow-md mt-4">
          <CardHeader>
            <CardTitle className="text-claybrown-main">Shopping List</CardTitle>
          </CardHeader>
          <CardContent>
            <ShoppingList items={items} onRemoveItem={removeItem} onQuantityChange={handleQuantityChange} getPrice={getPrice} />
          </CardContent>
        </Card>

      </div>
       {showCatalog && <Catalog onClose={() => setShowCatalog(false)} onPriceClick={handlePriceClick} />}
    </div>
  );
};

export default App;
