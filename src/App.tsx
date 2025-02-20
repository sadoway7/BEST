import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import ProductSelector from './components/ProductSelector';
import WeightSelector from './components/WeightSelector';
import QuantityInput from './components/QuantityInput';
import AddItemButton from './components/AddItemButton';
import ShoppingList from './components/ShoppingList';
import PricePreview from './components/PricePreview';
import Catalog from './components/Catalog';
import MobCatalog from './components/MobCatalog';
import { getAllProducts, getPrice as calculatePrice, getCategories } from './dataHandler';
import { Product } from './dataHandler';

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; items: { name: string }[] }[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [items, setItems] = useState<{ product: string; weight: string; quantity: number; price: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showCatalog, setShowCatalog] = useState(false);
  const selectedProductPricing = useMemo(() => products.filter(p => p.item === selectedProduct), [selectedProduct, products]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Example breakpoint

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const productsFromApi = await getAllProducts();
        setProducts(productsFromApi);
        setCategories(getCategories(productsFromApi));
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false); // Set loading to false when fetching completes or errors
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    if (!selectedProduct) return;
    const price = calculatePrice(selectedProduct, selectedWeight, quantity, products);
    setItems([...items, { product: selectedProduct, weight: selectedWeight, quantity, price }]);
    setSelectedProduct('');
    setSelectedWeight('');
    setQuantity(1);
  };
  
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  
  const handlePriceClick = (product: string, size: string | null) => {
    setSelectedProduct(product);
    setSelectedWeight(size || '');
    setQuantity(1);
  };
  
  const handleQuantityChange = (index: number, newQuantity: number) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], quantity: newQuantity, price: calculatePrice(updatedItems[index].product, updatedItems[index].weight, newQuantity, products) };
      return updatedItems;
    });
  };


  return (
    <div className="bg-gray-50 flex flex-col items-start sm:py-12 px-4 pt-0">
      <div className="relative py-3 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl w-full mx-auto">
        <Card className="w-full bg-white border-ui-border card-shadow rounded-xl">
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-xl font-semibold text-gray-800">Ceramics Canada Catalogue</CardTitle>
              <button onClick={() => setShowCatalog(true)} className="bg-primary-main hover:bg-primary-light text-white">
                Select from Catalog
              </button>
            </div>
          </CardHeader>
          <CardContent>
          {loading ? ( // Display loading message
              <p className="text-ui-text-secondary italic">Loading products...</p>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <ProductSelector categories={categories} selectedProduct={selectedProduct} onProductChange={setSelectedProduct} />
                  <WeightSelector pricing={selectedProductPricing} selectedWeight={selectedWeight} onWeightChange={setSelectedWeight} hideSelect={selectedProductPricing.length > 0 && !selectedProductPricing[0].size} />
                  <QuantityInput quantity={quantity} onQuantityChange={setQuantity} />
                </div>
                <PricePreview selectedProduct={selectedProduct} selectedWeight={selectedWeight} quantity={quantity} calculatePrice={calculatePrice} products={products}>
                  <AddItemButton onClick={addItem} />
                </PricePreview>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="w-full bg-white border-ui-border card-shadow rounded-xl mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Shopping List</CardTitle>
          </CardHeader>
          <CardContent>
            <ShoppingList items={items} onRemoveItem={removeItem} onQuantityChange={handleQuantityChange} calculatePrice={calculatePrice} products={products} />
          </CardContent>
        </Card>

      </div>
       {showCatalog && (isMobile ? (
          <MobCatalog onClose={() => setShowCatalog(false)} onPriceClick={handlePriceClick} products={products} />
        ) : (
          <Catalog onClose={() => setShowCatalog(false)} onPriceClick={handlePriceClick} products={products} />
        ))}
    </div>
  );
};

export default App;
