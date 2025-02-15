# Ceramics Canada Price Calculator

## Introduction

The Ceramics Canada Price Calculator is a user-friendly web application designed to simplify the process of calculating prices for Ceramics Canada products. Whether you are a customer planning a purchase, a sales representative preparing a quote, or simply curious about pricing, this app provides a quick and accurate way to determine the cost of various ceramics supplies.

## How to Use

Using the Ceramics Canada Price Calculator is straightforward:

1.  **Select a Product:** Begin by choosing a product category from the "Product Selector" dropdown. Once a category is selected, a second dropdown will appear allowing you to choose a specific product item within that category.
2.  **Choose Size/Weight (if applicable):** For products that come in different sizes or weights, the "Size" dropdown will be enabled. Select the desired size or weight for your chosen product. If a product does not have size variations, this selector will be hidden.
3.  **Enter Quantity:** In the "Quantity" input field, specify the number of units you wish to purchase. The application will use this quantity to calculate the price, taking into account any quantity-based discounts.
4.  **Preview Price:** The "Price Preview" section dynamically displays the calculated price based on your selections. It shows the unit price and the total price for the specified quantity.
5.  **Add to Shopping List:** Click the "Add Item" button to add the currently previewed item to your personal shopping list.
6.  **Manage Shopping List:** The "Shopping List" section below the product selector displays all the items you have added. In the shopping list, you can:
    -   **View Items:** See a clear list of products, sizes, quantities, unit prices, and total prices for each item.
    -   **Adjust Quantities:** Use the "+" and "-" buttons next to each item to modify the quantity directly in your shopping list. The price will update automatically.
    -   **Remove Items:** Click the "Trash" icon to remove an item from your shopping list.
    -   **View Grand Total:** The shopping list footer displays the grand total for all items in your list.

7.  **Browse Catalog (Optional):** For a comprehensive view of all available products, click the "Select from Catalog" button. This opens a full Product Catalog in a modal dialog, where you can browse categorized product listings and select items to quickly add to the Product Selector.

## Key Concepts & Features

*   **Product Catalog Browsing:** Easily explore the entire Ceramics Canada product range through the interactive catalog.
*   **Dynamic Price Calculation:** Get instant price updates as you change product options and quantities.
*   **Shopping List Management:** Create and manage a shopping list, adjusting quantities and removing items.
*   **WordPress API Integration:** (Mention this is for data fetching, but keep it high-level for general users). Data is fetched from the Ceramics Canada WordPress site to ensure up-to-date product information.
*   **Responsive Design:** (If applicable) The application is designed to work well on different screen sizes (desktop, mobile, tablet).

## Technical Overview (Architecture)

The Ceramics Canada Price Calculator is built using a modern component-based architecture, primarily using React and TypeScript. Here's a simplified overview of the application's structure:

*   **Data Source:** Product data is sourced from the Ceramics Canada WordPress website via a REST API endpoint.
*   **`src/dataHandler.tsx` (Data Fetching and Processing):** This module is the central point for data management. It contains the `getAllProducts` function, which is responsible for fetching product data from the WordPress API. It also includes functions for processing product data, such as `getCategories`, `getGroupedProducts`, `getPrice`, and `parseSize`.
*   **`App.tsx` (Main Application Component):** This is the main component that orchestrates the application. It fetches product data using `getAllProducts` from `src/dataHandler.tsx` and manages the application's state, including the product list, categories, shopping list items, and loading state. `App.tsx` then passes this data as props to various child components.
*   **Components ( `src/components` directory):** The application is built using reusable React components, each responsible for a specific part of the user interface and functionality. Key components include:
    -   `Catalog.tsx`: Displays the full product catalog in a modal.
    -   `ShoppingList.tsx`: Renders the user's shopping list and manages item quantities and removal.
    -   `ProductSelector.tsx`: Provides dropdowns for selecting product categories and items.
    -   `WeightSelector.tsx`: Allows users to select product sizes/weights (if applicable).
    -   `QuantityInput.tsx`: Input field for specifying product quantity.
    -   `PricePreview.tsx`: Displays the calculated price preview.
    -   `AddItemButton.tsx`: Button to add items to the shopping list.
    -   `ui/` (directory): Contains reusable UI primitives like `Card`, `CardHeader`, `CardTitle`, and `CardContent` for consistent styling.

## Component Review (Brief Descriptions)

*   **`AddItemButton`**:  A button labeled "Add Item" that adds the currently selected product to the shopping list.
*   **`Catalog`**: Displays a modal dialog with the full product catalog, categorized for easy browsing and selection.
*   **`PricePreview`**: Shows a preview of the calculated price for the selected product, size, and quantity.
*   **`ProductSelector`**: A dropdown menu to select product categories and items.
*   **`QuantityInput`**: A numerical input field for users to enter the desired product quantity.
*   **`ShoppingList`**: Renders the user's shopping list, allowing users to view, modify quantities, and remove items.
*   **`WeightSelector`**: A dropdown menu to select the size or weight of a product (if size variations are available).
*   **`ui/Card`, `ui/CardHeader`, `ui/CardTitle`, `ui/CardContent`**: Reusable UI components for creating styled card containers with headers, titles, and content areas, used throughout the application for layout and visual consistency.

## Possible Add-ons (Future Enhancements)

*   **Send Order Email to WordPress:** Implement a feature to send the shopping list/order details back to WordPress, enabling users to easily submit their orders or request quotes via email directly from the app.
*   **User Accounts and Saved Lists:** Allow users to create accounts to save their shopping lists, making it easy to manage and re-order frequently purchased items.
*   **Inventory Management Integration:** Integrate with a real-time inventory system to display product availability and prevent ordering out-of-stock items.
*   **Advanced Pricing Rules and Promotions:** Implement support for more complex pricing rules, volume discounts, promotional offers, and customer-specific pricing.

## Things to Understand (For Developers/Maintainers)

*   **Technology Stack:** The application is built using React, TypeScript, Vite, and Tailwind CSS. Ensure familiarity with these technologies for development and maintenance.
*   **Data Fetching Centralization:** All API interactions and data fetching logic are centralized within `src/dataHandler.tsx`. Any modifications to data fetching should primarily be done in this module.
*   **Component-Based Architecture:** The application follows a component-based architecture. Understand the role and props of each component before making changes. Data flow is primarily unidirectional, passed down via props from parent components (especially `App.tsx`) to child components.
*   **Styling with Tailwind CSS:** The application uses Tailwind CSS for styling. Adhere to Tailwind CSS conventions when making UI modifications or creating new components.
*   **Testing:** (Further development may include adding unit and integration tests to ensure code quality and prevent regressions.)
*   **Deployment:** (If deployment is considered) Briefly mention deployment considerations (e.g., platform, build process).

---

This `README.md` provides a comprehensive overview of the Ceramics Canada Price Calculator application, covering its usage, features, architecture, components, and potential future enhancements.
