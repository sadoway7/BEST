# Data Flow in Ceramics Canada Price Calculator

This document explains the data flow in the Ceramics Canada Price Calculator application after the introduction of the `src/dataHandler.tsx` module.

## Overview of Data Flow

The application's data flow is now centralized in the `src/dataHandler.tsx` module. This module is responsible for fetching, processing, and providing product data to various components in the application. The data flow can be summarized as follows:

1.  **Data Fetching:** The `src/dataHandler.tsx` module fetches product data from `products.json` using the `getAllProducts` function. This function returns an array of `Product` objects.
2.  **Data Processing:** The `src/dataHandler.tsx` module provides functions to process and transform the product data into formats suitable for different components:
    *   `getGroupedProducts(products: Product[])`: Groups products by category and item for the `Catalog` component.
    *   `getCategories(products: Product[])`: Extracts unique categories from the product data for the `ProductSelector` component.
    *   `getPrice(productName: string, weightSize: string, qty: number, products: Product[])`: Calculates the price for a given product, weight, and quantity, considering price breaks and discounts.
    *   `parseSize(sizeString: string | null)`: Parses and normalizes size strings.
3.  **Data Consumption:** Components like `App.tsx`, `Catalog.tsx`, `PricePreview.tsx`, `ProductSelector.tsx`, and `ShoppingList.tsx` import functions from `src/dataHandler.tsx` to access and utilize the processed product data.

## Component-Specific Data Flow

*   **`App.tsx`:**
    *   Fetches all products using `getAllProducts()` from `src/dataHandler.tsx` and stores it in the `products` state variable.
    *   Calculates categories using `getCategories(products)` and stores it in the `categories` state variable.
    *   Passes the `categories` to `ProductSelector`.
    *   Passes the `products` and `calculatePrice` function (which is `getPrice` from `dataHandler.tsx`) to `PricePreview`, `ShoppingList`, and `Catalog` components.
*   **`Catalog.tsx`:**
    *   Receives the `products` array as a prop from `App.tsx`.
    *   Uses the `products` prop to group and display products by category using the `getGroupedProducts` logic within the component itself (previously this logic was in `dataHandler.tsx`, but was moved back to the component for better component-specific data structuring).
    *   Calls `onPriceClick` prop function when a price is clicked, passing the product information back to `App.tsx`.
*   **`PricePreview.tsx`:**
    *   Receives `selectedProduct`, `selectedWeight`, `quantity`, `calculatePrice`, and `products` props from `App.tsx`.
    *   Uses the `calculatePrice` function and `products` prop to display the preview price.
*   **`ProductSelector.tsx`:**
    *   Receives the `categories` array as a prop from `App.tsx`.
    *   Displays product categories in a select dropdown.
*   **`ShoppingList.tsx`:**
    *   Receives `items`, `onRemoveItem`, `onQuantityChange`, `calculatePrice`, and `products` props from `App.tsx`.
    *   Uses the `calculatePrice` function and `products` prop to calculate and display prices in the shopping list.

## `src/dataHandler.tsx` Module

This module acts as a central data management layer, providing functions to access and manipulate product data. It encapsulates the data fetching and processing logic, making it easier to maintain and update the data handling in the application.

*   **`products.json`:**  Stores the raw product data.
*   **`Product` interface:** Defines the structure of a product object.
*   **`getAllProducts()`:** Fetches and returns all products from `products.json`.
*   **`getGroupedProducts()`:**  Groups products for the `Catalog` component.
*   **`getCategories()`:** Returns a list of product categories.
*   **`getPrice()`:** Calculates the price of a product based on quantity and discounts.
*   **`parseSize()`:** Utility function to parse and normalize product sizes.

By centralizing the data handling logic in `src/dataHandler.tsx`, the application achieves better code organization, reusability, and maintainability. Components now rely on well-defined functions to access and manipulate data, making the codebase cleaner and easier to understand.