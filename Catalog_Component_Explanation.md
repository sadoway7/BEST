# Catalog Component - Detailed Explanation

## Overview

The `Catalog` component is a React component designed to display a product catalog in a user-friendly, interactive manner. It presents product information in a table format, allowing users to browse products, view prices, and select items. The component is designed to be displayed as a modal overlay, providing a focused view of the product catalog.

## How the Catalog is Opened

The `Catalog` component is typically opened by a parent component. This parent component would likely have a button or other UI element that, when clicked, sets a state variable to indicate that the catalog should be displayed. This state variable is then passed as a prop (e.g., `isOpen`) to the `Catalog` component. The `Catalog` component would then conditionally render its content based on the value of this prop. The `onClose` prop is then used to update the parent component's state to close the catalog.

## Props

The `Catalog` component accepts the following props:

*   `onClose`: A function that is called when the user wants to close the catalog (e.g., by clicking a "Close" button or clicking outside the catalog). This prop is essential for controlling the visibility of the catalog.
*   `onPriceClick`: A function that is called when the user clicks on a product price. This function receives the product name and size as arguments, allowing the parent component to handle the selection (e.g., add the product to a shopping list).

## Data Handling (products.json)

The component retrieves product data from a JSON file named `products.json`. This file is assumed to contain an array of product objects, each with properties like:

*   `category`: The category of the product (e.g., "Fruits", "Vegetables").
*   `item`: The name of the product (e.g., "Apple", "Banana").
*   `size`: The size or quantity of the product (e.g., "1 kg", "1 lb", `null` for a general price).
*   `price`: The price of the product.

The component uses this data to display the catalog.

## Component Structure

The `Catalog` component is structured as a modal overlay. It consists of the following main elements:

1.  **Modal Container:** A `div` element that covers the entire screen with a semi-transparent background, creating a modal effect. This container has the following styling:
    *   `absolute top-0 left-0 w-full h-full`: Positions the container to cover the entire screen.
    *   `bg-black bg-opacity-50`: Sets a semi-transparent black background.
    *   `flex justify-center items-start`: Centers the catalog horizontally and aligns it to the top vertically.
    *   `overflow-y-auto`: Enables vertical scrolling for the modal container itself, if the content overflows.
    *   `pt-10 pb-10`: Adds padding to the top and bottom.
    *   `scrollable`: This class is not defined in the code, but it is likely used to enable scrolling within the modal.
2.  **Catalog Container:** A `div` element that contains the catalog content, styled with a background color, padding, rounded corners, and a maximum width. This container has the following styling:
    *   `bg-bg-light`: Sets the background color.
    *   `p-4 sm:p-6`: Adds padding.
    *   `rounded-lg`: Rounds the corners.
    *   `shadow-xl`: Adds a shadow.
    *   `w-full sm:max-w-lg md:max-w-xl lg:max-w-5xl xl:max-w-7xl`: Sets the maximum width for different screen sizes, ensuring the catalog doesn't become too wide on larger screens.
    *   `border border-gray-200`: Adds a border.
    *   `relative`: Sets the positioning context for the close button.
3.  **Header:** Includes a title ("Product Catalog") and a brief description.
4.  **Close Button:** A button in the top-right corner that calls the `onClose` prop function when clicked. It is positioned absolutely within the catalog container.
5.  **Product Categories:** The main content of the catalog, displaying products grouped by category. Each category is represented by a table.

## State Management

The component uses the `useState` hook to manage the following state:

*   `collapsedSections`: An object that stores the collapsed/expanded state of each product category. Initially, all categories are collapsed. Clicking on a category header toggles its collapsed state.

## Rendering Logic

The component renders the product catalog based on the data from `products.json` and the state. The rendering logic can be summarized as follows:

1.  **Group Products:** The product data is grouped by category and item to create a nested structure.
2.  **Category Iteration:** The component iterates through the grouped products, rendering a table for each category.
3.  **Category Header:** Each category table starts with a header row that displays the category name. Clicking the header toggles the visibility of the items within that category.
4.  **Item Rows:** If a category is not collapsed, the component renders rows for each item within that category.
5.  **Price Cells:** Each item row displays the prices for different sizes. The prices are displayed as clickable elements.
6.  **Clickable Prices:** Clicking a price calls the `onPriceClick` prop function, passing the product name and size, and then calls the `onClose` prop function to close the catalog.

## Event Handling

The component handles the following events:

*   **`onClose`:** Called when the user clicks the close button or outside the catalog. This event is handled by the parent component.
*   **`onPriceClick`:** Called when the user clicks on a product price. This event is handled by the parent component.
*   **Category Header Click:** Clicking on a category header toggles the visibility of the items within that category. This is handled by the `toggleSection` function, which updates the `collapsedSections` state.

## `parseSize` Function

The `parseSize` function is used to convert size strings (e.g., "10g", "2 kg") into a normalized numeric value (in grams or milliliters). This function is used to sort the sizes in the table. It handles different units and performs conversions.