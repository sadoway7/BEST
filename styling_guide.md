# Styling Guide for Ceramics Canada Price Calculator

This guide explains how the Ceramics Canada Price Calculator application is styled. The application uses a combination of Tailwind CSS, custom color palettes, and component-level styling.

## Technologies Used

*   **Tailwind CSS:** A utility-first CSS framework. Most of the styling is done using Tailwind classes directly in the HTML/JSX.
*   **React:** The JavaScript library used to build the user interface.
*   **TypeScript:** The language used to write the application code.

## How Styling Works

1.  **Tailwind Classes:** Tailwind CSS utility classes are used extensively throughout the application. These classes are applied directly to HTML elements within the JSX components. Examples include `bg-bg-main`, `text-claybrown-main`, `flex`, `flex-col`, `items-start`, `sm:py-12`, etc.

2.  **Custom Color Palette:** The `tailwind.config.js` file extends the default Tailwind theme by defining custom color palettes. These palettes include:

    *   `terracotta`: `main`, `light`, `lighter`
    *   `claybrown`: `main`, `light`, `lighter`
    *   `warmbeige`: `main`, `light`, `lighter`
    *   `bg`: `main`, `light`, `darker`

    These custom colors are used throughout the application.

3.  **Global Styles:** The `src/index.css` file contains global styles that apply to the entire application. These styles include:

    *   Importing Tailwind directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`).
    *   Styling for the `body` element (background color, text color, font size).
    *   Styling for inputs and buttons.
    *   Styling for scrollbars.

4.  **Component-Level Styling:** Individual components, such as `Card`, `ProductSelector`, `WeightSelector`, `QuantityInput`, `AddItemButton`, `ShoppingList`, `PricePreview`, and `Catalog`, use Tailwind classes to style their elements. The `src/components/ui/card.tsx` file provides a good example of how components are styled.

## Making Styling Changes

To make changes to the styling, you can modify the following:

1.  **Tailwind Classes:** Add, remove, or modify Tailwind classes directly in the JSX of the components. This is the primary way to change the appearance of elements.

2.  **`tailwind.config.js`:** To change the color palette or other theme settings, modify the `tailwind.config.js` file. You can add, remove, or modify colors, fonts, spacing, and other theme values.

3.  **`src/index.css`:** To change global styles, modify the `src/index.css` file. Be careful when modifying global styles, as they can affect the entire application.

## Example: Changing the Background Color of the App

1.  **Locate the relevant component:** In this case, the main app component is `src/App.tsx`.
2.  **Find the element with the background color:** The main `div` element in `App.tsx` has the class `bg-bg-main`.
3.  **Modify the class:** To change the background color, you can change the `bg-bg-main` class to another Tailwind class, such as `bg-warmbeige-lighter` or a custom color defined in `tailwind.config.js`. For example:

    ```tsx
    <div className="bg-warmbeige-lighter py-6 flex flex-col items-start sm:py-12 px-2 pt-6">
    ```

    This will change the background color of the app to the `warmbeige-lighter` color.

By understanding these principles, you can effectively customize the styling of the Ceramics Canada Price Calculator application.