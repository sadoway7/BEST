# Revised Plan for Integrating WordPress REST API - Version 4 (Data Flow Clarified)

This document provides a clear, self-contained plan to integrate a WordPress REST API for fetching product data into the Ceramics Canada Price Calculator application. **All data fetching is centralized in `src/dataHandler.tsx`, which acts as the single source of product data for the entire application. Components like `App.tsx` and `Catalog.tsx` receive data as props and focus on presentation and user interface logic.**

## 1. Understand the WordPress REST API Endpoint:

*   **API Endpoint:**  `/wp-json/cclist/v1/products` (GET request).
*   **API Response Structure:** JSON array of product objects (category, item, size, quantity_min, quantity_max, price, discount). *(See previous versions for example JSON)*
*   **Authentication:**  *(Please confirm if API authentication is required.)*

## 2. Central Data Fetching in `src/dataHandler.tsx`:

*   **Update `getAllProducts()` Function:**  `src/dataHandler.tsx` will be modified to fetch data from the WordPress API. This function becomes the *single point of data fetching* for the application.

    ```typescript
    // src/dataHandler.tsx
    import { Product } from './Product';

    export const getAllProducts = async (): Promise<Product[]> => {
      try {
        const response = await fetch('/wp-json/cclist/v1/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching product data from WordPress API:", error);
        return [];
      }
    };
    ```

*   **Data Processing Functions (in `src/dataHandler.tsx`):**  `src/dataHandler.tsx` *continues* to provide these functions to process data (no changes needed here):
    *   `getGroupedProducts(products: Product[])`: Groups products for `Catalog`.
    *   `getCategories(products: Product[])`: Gets categories for `ProductSelector`.
    *   `getPrice(productName: string, weightSize: string, qty: number, products: Product[])`: Calculates price.
    *   `parseSize(sizeString: string | null)`: Parses sizes.

*   **Remove `products.json`:** Delete `products.json` and remove `import productData from './products.json';` from `src/dataHandler.tsx`.

## 3. Component Data Flow - Props from `App.tsx`:

*   **`App.tsx` - Fetches and Distributes Data:**
    *   `App.tsx` is responsible for initiating data fetching by calling `getAllProducts()` from `src/dataHandler.tsx`.
    *   `App.tsx` *receives* the product data from `dataHandler.tsx`.
    *   `App.tsx` then *passes* this data as the `products` prop to `Catalog.tsx`, `PricePreview.tsx`, and `ShoppingList.tsx`.
    *   `App.tsx` also calculates categories and passes them to `ProductSelector.tsx`.
    *   **Important:** `App.tsx` does *not* directly provide data to `Catalog.tsx` in a fetching sense. It acts as a conduit, passing the data it *receives from `dataHandler.tsx`* down to `Catalog.tsx` and other components via props.

    ```typescript
    // App.tsx (Example - Data fetching and prop distribution)
    import { getAllProducts, getPrice as calculatePrice, getCategories } from './dataHandler';
    import React, { useState, useEffect, useMemo } from 'react';

    interface AppProps {} // Define AppProps if needed

    const App: React.FC<AppProps> = () => {
      const [products, setProducts] = useState<Product[]>([]);
      const [categories, setCategories] = useState([]);
      const [loading, setLoading] = useState(true);
      const [items, setItems] = useState([]); 
      const [selectedProduct, setSelectedProduct] = useState('');
      const [selectedWeight, setSelectedWeight] = useState('');
      const [quantity, setQuantity] = useState(1);
      const [showCatalog, setShowCatalog] = useState(false);
      const selectedProductPricing = useMemo(() => products.filter(p => p.item === selectedProduct), [selectedProduct, products]);


      useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const productsFromApi = await getAllProducts();
            setProducts(productsFromApi);
            setCategories(getCategories(productsFromApi));
          } catch (error) {
            console.error("Error fetching product data:", error);
          } finally {
            setLoading(false);
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
        <div className="bg-bg-main py-6 flex flex-col items-start sm:py-12 px-2 pt-6">
          <h1 className="text-3xl font-bold text-center w-full mb-4 text-claybrown-main">Ceramics Canada Price Calculator</h1>
          <div className="relative py-3 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl w-full mx-auto">
            <Card className="w-full bg-bg-light border-gray-200 shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center w-full">
                  <CardTitle className="text-claybrown-main">Product Selector</CardTitle>
                  <button onClick={() => setShowCatalog(true)} className="bg-terracotta-main hover:bg-terracotta-light text-white font-bold py-2 px-4 rounded">
                    Select from Catalog
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <ProductSelector categories={categories} selectedProduct={selectedProduct} onProductChange={setSelectedProduct} />
                  <WeightSelector pricing={selectedProductPricing} selectedWeight={selectedWeight} onWeightChange={setSelectedWeight} hideSelect={selectedProductPricing.length > 0 && !selectedProductPricing[0].size} />
                  <QuantityInput quantity={quantity} onQuantityChange={setQuantity} />
                </div>
                <PricePreview selectedProduct={selectedProduct} selectedWeight={selectedWeight} quantity={quantity} calculatePrice={calculatePrice} products={products}>
                  <AddItemButton onClick={addItem} />
                </PricePreview>
              </CardContent>
            </Card>

            <Card className="w-full bg-bg-light border-gray-200 shadow-md mt-4">
              <CardHeader>
                <CardTitle className="text-claybrown-main">Shopping List</CardTitle>
              </CardHeader>
              <CardContent>
                <ShoppingList items={items} onRemoveItem={removeItem} onQuantityChange={handleQuantityChange} calculatePrice={calculatePrice} products={products} />
              </CardContent>
            </Card>

          </div>
           {showCatalog && <Catalog onClose={() => setShowCatalog(false)} onPriceClick={handlePriceClick} products={products} />}
        </div>
      );
    };

    export default App;