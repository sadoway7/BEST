# Application Outline: Ceramics Canada Catalogue - Detailed File Breakdown (Part 3)

## 3. Data Flow and Component Interactions

### 3.1. Data Flow

The application's data flow can be summarized as follows:

1.  **Initial Data Fetch:** When the `App` component mounts, it triggers `getAllProducts()` from `dataHandler.tsx`.
2.  **Data Retrieval:** `getAllProducts()` fetches product data. By default, it attempts to retrieve data from the WordPress REST API endpoint (`/wp-json/cclist/v1/products`). If `USE_DUMMY_DATA` is set to `true` in `dataHandler.tsx`, it uses the local `dummyProducts` data instead.
3.  **Data Processing in `dataHandler`:**  `dataHandler.tsx` processes the fetched data:
    *   Parses prices to numbers.
    *   Normalizes product sizes using `parseSize()`.
    *   Handles potential API errors.
4.  **Data Storage in `App.tsx` State:** The fetched and processed product data (`Product[]`) is stored in the `products` state variable within `App.tsx`. Category data is also derived from products using `getCategories()` and stored in the `categories` state.
5.  **Data Distribution to UI Components:** `App.tsx` then distributes this data to various UI components via props:
    *   `Catalog` and `MobCatalog`: Receive the `products` array to display the product catalog.
    *   `ProductSelector`: Receives the `categories` array for product selection suggestions.
    *   `WeightSelector`: Receives `selectedProductPricing` (filtered product data for the selected product) to populate size options.
    *   `PricePreview`: Receives `selectedProduct`, `selectedWeight`, `quantity`, and `products` to calculate and display the price preview.
    *   `ShoppingList`: Receives the `items` array (shopping list items) and `products` for displaying the shopping list and calculating item prices.
6.  **User Interaction and State Updates:** User interactions in UI components trigger state updates in `App.tsx`:
    *   `ProductSelector`'s `onProductChange` updates `selectedProduct` state.
    *   `WeightSelector`'s `onWeightChange` updates `selectedWeight` state.
    *   `QuantityInput`'s `onQuantityChange` updates `quantity` state.
    *   Catalog components' `onPriceClick` updates `selectedProduct`, `selectedWeight`, and resets `quantity` state.
    *   `AddItemButton`'s `onClick` calls `addItem()` in `App.tsx`, which adds a new item to the `items` (shopping list) state.
    *   `ShoppingList`'s quantity controls and remove buttons call `onQuantityChange` and `onRemoveItem` props, which update the `items` state in `App.tsx`.
7.  **Price Calculation Flow:** Price calculations are primarily handled by the `getPrice()` function in `dataHandler.tsx`. This function is used by:
    *   `PricePreview` to display the price before adding an item.
    *   `AddItemButton` (indirectly through `addItem()` in `App.tsx`) to calculate the initial price when adding an item.
    *   `ShoppingList` to display prices for items in the list and recalculate prices when quantities change.
    *   `App.tsx` to update item prices in the shopping list when quantities are changed.

**Simplified Data Flow Diagram:**

```
+-----------------+     fetchData()     +---------------------+     setProducts(), setCategories()    +-------------+
|  App.tsx        | ------------------> |  dataHandler.tsx    | -------------------------------------> |  App.tsx    |
| (Main Component)|                     | (Data Module)       |                                        | (State:      |
+-----------------+                     +---------------------+                                        |  products,   |
                                              ^                                                          |  categories) |
                                              | getAllProducts()                                         +-------------+
                                              |                                                                ^
                                              | Product Data (API/Dummy)                                       | props
                                              +------------------------------------------------------------------+
                                                                      |
                                                                      v Data Distribution (props)
+---------------------+   +---------------------+   +---------------------+   +---------------------+   +---------------------+
|  Catalog.tsx        |   |  ProductSelector.tsx|   |  WeightSelector.tsx|   |  PricePreview.tsx   |   |  ShoppingList.tsx |
|  (Catalog UI)       |   |  (Product Input)   |   |  (Product Input)   |   |  (Product Input)   |   |  (Shopping List UI)|
+---------------------+   +---------------------+   +---------------------+   +---------------------+   +---------------------+
                                                                      |
                                                                      v User Interactions (callbacks)
+----------------------------------------------------------------------+
|  App.tsx (State Updates: selectedProduct, selectedWeight, quantity, items) |
+----------------------------------------------------------------------+
```


### 3.2. Component Interactions

The main components interact as follows:

*   **`App.tsx` and `dataHandler.tsx`:** `App.tsx` is the orchestrator and data consumer, while `dataHandler.tsx` is the data provider. `App.tsx` calls functions from `dataHandler.tsx` (like `getAllProducts`, `getPrice`, `getCategories`) to fetch and process data. `dataHandler.tsx` is independent of UI components and focuses solely on data logic.

*   **`App.tsx` and Catalog Components (`Catalog.tsx`, `MobCatalog.tsx`):** `App.tsx` renders either `Catalog` or `MobCatalog` based on screen size. It passes down:
    *   `products` prop:  The product data to be displayed in the catalog.
    *   `onClose` prop:  A callback function to close the catalog modal (managed by `App.tsx` state).
    *   `onPriceClick` prop: A callback function to handle product selection from the catalog. When a user selects a product in the catalog, `Catalog`/`MobCatalog` calls `onPriceClick`, which updates the `selectedProduct`, `selectedWeight`, and `quantity` state in `App.tsx`.

*   **`App.tsx` and Product Input Components (`ProductSelector.tsx`, `WeightSelector.tsx`, `QuantityInput.tsx`, `PricePreview.tsx`, `AddItemButton.tsx`):** These components form the product input area in `App.tsx`.
    *   `ProductSelector`: Receives `categories` and `selectedProduct` as props and uses `onProductChange` callback to update `selectedProduct` in `App.tsx`.
    *   `WeightSelector`: Receives `selectedProductPricing`, `selectedWeight`, and `hideSelect` as props and uses `onWeightChange` to update `selectedWeight` in `App.tsx`.
    *   `QuantityInput`: Receives `quantity` as prop and uses `onQuantityChange` to update `quantity` in `App.tsx`.
    *   `PricePreview`: Receives `selectedProduct`, `selectedWeight`, `quantity`, `calculatePrice`, and `products` to display the price preview. It also renders `AddItemButton` as a child.
    *   `AddItemButton`: Receives `onClick` prop, which is connected to the `addItem()` function in `App.tsx`. When clicked, it triggers adding the current product selection to the shopping list.

*   **`App.tsx` and `ShoppingList.tsx`:** `App.tsx` renders `ShoppingList` and passes down:
    *   `items` prop: The shopping list items to be displayed.
    *   `onRemoveItem` prop: Callback to remove an item from the shopping list.
    *   `onQuantityChange` prop: Callback to update the quantity of an item in the shopping list.
    *   `calculatePrice` and `products` props:  Needed for price calculations within the shopping list.

**Component Interaction Diagram (Simplified):**

```
App.tsx (Parent)
├── dataHandler.tsx (Data Source - no direct UI interaction)
├── Catalog.tsx / MobCatalog.tsx (Modal Catalogs)
│   └── (Interacts with App.tsx via onClose, onPriceClick props)
├── ProductSelector.tsx (Product Input)
│   └── (Interacts with App.tsx via onProductChange prop)
├── WeightSelector.tsx (Product Input)
│   └── (Interacts with App.tsx via onWeightChange prop)
├── QuantityInput.tsx (Product Input)
│   └── (Interacts with App.tsx via onQuantityChange prop)
├── PricePreview.tsx (Product Input)
│   └── AddItemButton.tsx (Product Input)
│       └── (Interacts with App.tsx via onClick prop - addItem())
└── ShoppingList.tsx (Shopping List Display)
    └── (Interacts with App.tsx via onRemoveItem, onQuantityChange props)
```

This section outlines the primary data flow and component interactions within the application, providing a higher-level understanding of how different parts of the application work together.