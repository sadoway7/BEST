# Plan for Creating a Data Handler Module

This document outlines the plan for creating a separate module (`src/dataHandler.tsx`) to handle the data for the `Catalog` component and the "calculator part" (`src/App.tsx`).

## 1. Analyze the existing data handling logic:

*   Carefully examine the data handling logic in `src/App.tsx` and `src/components/Catalog.tsx` to identify the common data transformations and calculations.
*   Identify the specific data structures used by each component and how they are used.
*   Consider how `PricePreview.tsx`, `ProductSelector.tsx`, `ShoppingList.tsx`, and `WeightSelector.tsx` depend on the data handling logic.
*   **Specifically analyze how products with price breaks are handled and identify the cause of the potential duplication issue.**

## 2. Define a common data structure:

*   Based on the analysis, define a common data structure that can be used as the basis for all components. This data structure should be flexible enough to accommodate the different requirements of each component.
*   The common data structure will likely include the following:
    *   A list of all products with their properties (category, item, size, price, quantity_min, quantity_max, discount, etc.).
*   **The common data structure should ensure that products with price breaks are only listed once, with the price breaks handled as a property of the product.**

## 3. Create a new file (`src/dataHandler.tsx`):

*   Create a new file named `src/dataHandler.tsx` to encapsulate the data handling logic.

## 4. Implement data processing functions:

*   In `src/dataHandler.tsx`, implement functions that take the common data structure as input and return the data in the format required by each component.
    *   `getAllProducts()`: Returns the list of all products from `products.json`. This will be the base data.
    *   `getGroupedProducts(products: Product[])`: Takes the list of products and returns the grouped structure of products by category and item, suitable for the `Catalog` component. **This function should ensure that products with price breaks are only listed once.**
    *   `getPrice(productName: string, weightSize: string, qty: number, products: Product[])`: Takes the list of products and calculates the price based on the selected product, weight, and quantity, suitable for the "calculator part" (`src/App.tsx`). **This function should correctly handle price breaks based on the quantity.**
    *   `getCategories(products: Product[])`: Takes the list of products and returns a list of categories, suitable for the `ProductSelector` component.

## 5. Export the functions and types:

*   Export the functions and types from `src/dataHandler.tsx` so that they can be used by other components.

## 6. Update `src/App.tsx`:

*   Import the functions and types from `src/dataHandler.tsx`.
*   Replace the existing data handling logic with calls to the imported functions, ensuring it receives the data in the format it needs.
*   Update the component to use the common data structure.

## 7. Update `src/components/Catalog.tsx`:

*   Import the functions and types from `src/dataHandler.tsx`.
*   Replace the existing data handling logic with calls to the imported functions, ensuring it receives the data in the format it needs.
*   Update the component to use the common data structure.

## 8. Update `src/components/PricePreview.tsx`:

*   Import the `getPrice` function from `src/dataHandler.tsx`.

## 9. Update `src/components/ProductSelector.tsx`:

*   Import the `getCategories` function from `src/dataHandler.tsx`.

## 10. Update `src/components/ShoppingList.tsx`:

*   Import the `getPrice` function from `src/dataHandler.tsx`.

## 11. Update `src/components/WeightSelector.tsx`:

*   No changes needed.

## 12. Test the changes:

*   Thoroughly test the changes to ensure that all components are working correctly and that the data is being handled consistently.
*   **Specifically test the handling of products with price breaks to ensure that they are only listed once and that the correct price is calculated based on the quantity.**

## 13. Refactor `parseSize` function:

*   Since the `parseSize` function is only used in `src/components/Catalog.tsx`, move it to `src/dataHandler.tsx` and export it.

## 14. Update `src/components/Catalog.tsx`:

*   Import the `parseSize` function from `src/dataHandler.tsx`.