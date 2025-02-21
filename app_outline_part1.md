# Application Outline: Ceramics Canada Catalogue - Detailed File Breakdown (Part 1)

## 1. File Tree Structure

```
.
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── old-md/
│   ├── api_demo.md
│   ├── Catalog_Component_Explanation.md
│   ├── data_handler_plan.md
│   ├── styling_guide.md
│   └── wordpress_plugin_requirements.md
└── src/
    ├── App.tsx
    ├── dataHandler.tsx
    ├── dummyData.ts
    ├── index.css
    ├── main.tsx
    ├── products.json
    ├── vite-env.d.ts
    └── components/
        ├── AddItemButton.tsx
        ├── Catalog.tsx
        ├── MobCatalog.tsx
        ├── PricePreview.tsx
        ├── ProductSelector.tsx
        ├── QuantityInput.tsx
        ├── ShoppingList.tsx
        ├── WeightSelector.tsx
        └── ui/
            └── card.tsx
```

## 2. Detailed Module and File Breakdown

### 2.1. Data Module - `src/dataHandler.tsx`

**File Description:**

This file is the **data handling module** of the application. It is responsible for fetching, processing, and providing product data to the application's components. It acts as an interface between the application's frontend and the backend data source (which can be either a WordPress API or dummy data).

**(Rest of the detailed description for dataHandler.tsx from previous response)**

**Internal Structure/Function Flow (within `dataHandler.tsx`):**

```
dataHandler.tsx
├── Constants
│   └── USE_DUMMY_DATA
├── Interfaces
│   ├── Product
│   └── GroupedProducts
├── Functions
│   ├── parseSize
│   ├── getAllProducts
│   │   ├── fetch API (/wp-json/cclist/v1/products) or use dummyData
│   │   └── data parsing and error handling
│   ├── getGroupedProducts
│   │   └── products.reduce (grouping logic)
│   ├── getPrice
│   │   ├── products.filter (find pricing entries)
│   │   └── pricing logic and discount calculation
│   └── getCategories
│       ├── new Map() (categoryMap)
│       └── products.forEach (category mapping)
```


### 2.2. UI Modules - `src/components`

#### 2.2.1. Catalog Module - `src/components/Catalog.tsx` (Desktop Catalog)

**File Description:**

This file implements the **product catalog component** for desktop view. It displays products in a categorized and searchable format, allowing users to browse and select products to add to their shopping list.

**(Rest of the detailed description for Catalog.tsx from previous response)**

**Component Hierarchy (within `Catalog.tsx`):**

```
Catalog (Modal Overlay)
├── div (Side Categories - left side)
│   ├── div (Search Input)
│   │   ├── input (Search products...)
│   │   └── Search Icon
│   └── div (Category List)
│       └── div (Category Item - map over categories)
├── div (Product List - right side)
│   ├── div (Header)
│   │   ├── h2 (Category Name or "All Products")
│   │   └── button (Close button with X icon)
│   └── div (Product Items)
│       ├── div (Instruction Text)
│       └── div (Category Sections - map over filteredProducts)
│           └── div (Category Section)
│               ├── div (Category Title - conditionally rendered)
│               └── div (Item List)
│                   └── div (Item - map over items in category)
│                       ├── div (Item Header - expandable)
│                       │   ├── span (Item Name)
│                       │   └── Chevron Icon (Right/Down based on expansion)
│                       └── div (Variant List - conditionally rendered, expanded)
│                           └── div (Variant - map over variants/sizes)
│                               ├── div (Variant Size)
│                               └── div (Variant Price & Quantity Range)
```

#### 2.2.2. Catalog Module - `src/components/MobCatalog.tsx` (Mobile Catalog)

**File Description:**

This file implements the **product catalog component optimized for mobile view**. It's designed to provide a user-friendly catalog experience on smaller screens, with a slightly different layout and interaction patterns compared to the desktop `Catalog` component.

**(Rest of the detailed description for MobCatalog.tsx from previous response)**

**Component Hierarchy (within `MobCatalog.tsx`):**

```
MobCatalog (Modal Overlay)
├── div (Search and Categories - top section)
│   ├── div (Close Button Container - absolute positioned)
│   │   └── button (Close button with X icon)
│   ├── form (Search Form)
│   │   ├── input (Search products...)
│   │   └── Search Icon
│   └── div (Category Select Dropdown Container)
│       └── select (Category Select)
│           └── option (Category Options - map over categories)
├── div (Product List - bottom section)
│   ├── div (Header)
│   │   └── h2 (Category Name or "All Products")
│   └── div (Product Items)
│       ├── div (Instruction Text)
│       └── div (Category Sections - map over filteredProducts)
│           └── div (Category Section)
│               └── div (Item List)
│                   └── div (Item - map over items)
│                       ├── div (Item Header - expandable)
│                       │   ├── span (Item Name)
│                       │   └── Chevron Icon (Right/Down based on expansion)
│                       └── div (Variant List - conditionally rendered, expanded)
│                           └── div (Variant - map over variants/sizes)
│                               ├── div (Variant Size)
│                               └── div (Variant Price & Quantity Range)
```


#### 2.2.3. Product Input Module - `src/components/ProductSelector.tsx`

**File Description:**

This file implements a **searchable product selector component**. It allows users to search for and select a product from a dropdown list, enhancing the user experience for product selection in the main application UI.

**(Rest of the detailed description for ProductSelector.tsx from previous response)**

**Component Hierarchy (within `ProductSelector.tsx`):**

```
ProductSelector
├── div (Label and Input Container)
│   ├── label (Product)
│   └── div (Relative Input Container - for dropdown positioning)
│       ├── input (Search products...)
│       ├── div (Search Icon - absolute positioned)
│       └── div (Dropdown - conditionally rendered)
│           └── div (Dropdown Item - map over filteredItems)
```

#### 2.2.4. Product Input Module - `src/components/WeightSelector.tsx`

**File Description:**

This file implements a **weight/size selector component**, typically a dropdown select, that allows users to choose a specific weight or size for a product.

**(Rest of the detailed description for WeightSelector.tsx from previous response)**

**Component Hierarchy (within `WeightSelector.tsx`):**

```
WeightSelector
├── div (Label and Select Container)
│   ├── label (Size)
│   └── div (Relative Select Container)
│       ├── select (Weight/Size dropdown)
│       │   ├── option (Select a size - placeholder)
│       │   └── option (Size options - map over uniqueSizes)
│       └── div (Dropdown Arrow Icon - absolute positioned)
```

#### 2.2.5. Product Input Module - `src/components/QuantityInput.tsx`

**File Description:**

This file implements a **quantity input component** with increment and decrement buttons. It provides a user-friendly way to adjust the quantity of a product, ensuring that the quantity is always a positive integer.

**(Rest of the detailed description for QuantityInput.tsx from previous response)**

**Component Hierarchy (within `QuantityInput.tsx`):**

```
QuantityInput
├── div (Label and Input Container)
│   ├── label (Quantity)
│   └── div (Relative Input and Buttons Container)
│       ├── button (Decrement "-" button - absolute positioned left)
│       ├── input (Number input field)
│       └── button (Increment "+" button - absolute positioned right)
```

#### 2.2.6. Product Input Module - `src/components/PricePreview.tsx`

**File Description:**

This file implements the **price preview component**. It displays a summary of the selected product, size, quantity, and the calculated total price before the item is added to the shopping list.

**(Rest of the detailed description for PricePreview.tsx from previous response)**

**Component Hierarchy (within `PricePreview.tsx`):**

```
PricePreview
├── div (Main container - card styling)
│   ├── div (Header)
│   │   ├── h3 (Price Preview)
│   │   └── span (Unit Price - conditionally rendered)
│   ├── div (Price Table - conditionally rendered if product selected)
│   │   └── table
│   │       ├── thead
│   │       │   └── tr (Table Header Row)
│   │       │       ├── th (Product Header)
│   │       │       ├── th (Size Header)
│   │       │       ├── th (Quantity Header)
│   │       │       └── th (Total Price Header)
│   │       └── tbody
│   │           └── tr (Price Summary Row)
│   │               ├── td (Product Name)
│   │               ├── td (Product Size)
│   │               ├── td (Quantity)
│   │               └── td (Total Price)
│   ├── p (Select a product message - conditionally rendered if no product selected)
│   └── div (Children Container)
│       └── {children} (AddItemButton)
```

#### 2.2.7. Product Input Module - `src/components/AddItemButton.tsx`

**File Description:**

This file implements a simple **"Add Item" button component**. Its primary function is to trigger the action of adding a product to the shopping list when clicked.

**(Rest of the detailed description for AddItemButton.tsx from previous response)**

**Component Hierarchy (within `AddItemButton.tsx`):**

```
AddItemButton
└── button (Styled "Add Item" button)
    ├── svg (Plus "+" icon)
    └── span ("Add Item" text)
```


### 2.3. Main Application Module - `src/App.tsx`

**File Description:**

This file is the **main application component** and the entry point for the user interface of the React application. It orchestrates the different UI components, manages application state, and connects them to the data handling logic.

**(Rest of the detailed description for App.tsx from previous response)**

**Component Hierarchy (within `src/App.tsx`):**

```
App
├── Card (Catalogue Card)
│   ├── CardHeader
│   │   ├── CardTitle (Ceramics Canada Catalogue)
│   │   └── button (Select from Catalogue)
│   └── CardContent
│       ├── Loading indicator (conditionally rendered)
│       ├── ProductSelector
│       ├── WeightSelector
│       ├── QuantityInput
│       └── PricePreview
│           └── AddItemButton
├── Card (Shopping List Card)
│   ├── CardHeader
│   │   └── CardTitle (Shopping List)
│   └── CardContent
│       └── ShoppingList
├── Catalog (conditionally rendered, desktop)
└── MobCatalog (conditionally rendered, mobile)