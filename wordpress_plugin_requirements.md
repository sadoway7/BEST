# Third-Party Program REST API Requirements

## Program Integration Notice

Your program needs to implement the following REST API endpoint to integrate with our WordPress catalog plugin. **Crucially, our plugin handles all data processing and organization internally. You must provide a flat array of products, with each size variation of a product represented as a separate entry.**

## Required Endpoint

**GET /wp-json/cclist/v1/products**

*   **Must return a FLAT ARRAY of products.**
*   No pagination is required (we handle all data at once).
*   Response Format:

    ```typescript
    interface Product {
      category: string; // Category name
      item: string; // Product name
      size: string; // Size/weight
      price: number; // Base price for this specific size
      quantity_min?: number; // Optional: Minimum quantity for this price
      quantity_max?: number | null; // Optional: Maximum quantity for this price
      discount?: number; // Optional: Discount as decimal (e.g., 0.1 for 10% off)
    }
    ```

**Example Response (Illustrating Flat Array with Multiple Sizes):**

```json
[
  {
    "category": "Supplements",
    "item": "Vitamin C",
    "size": "100g",
    "price": 19.99,
    "quantity_min": 1,
    "quantity_max": 10
  },
  {
    "category": "Supplements",
    "item": "Vitamin C",
    "size": "250g",
    "price": 39.99,
    "quantity_min": 1,
    "quantity_max": 5
  },
  {
    "category": "Medications",
    "item": "Pain Relief",
    "size": "50ml",
    "price": 9.99
  }
]
```

**Explanation of the Example:**

Notice how "Vitamin C" appears *twice* in the array, once for the "100g" size and once for the "250g" size. This is the **flat array** structure we require. Each size variation of the *same* product must be a separate object in the array.

## Error Response Format

If there's an error, return:

```json
{
  "code": "ERROR_CODE",
  "message": "Error message"
}
```

## Important Notes

1.  All prices must be numbers (we will convert them using `parseFloat` if needed).
2.  The `size` field accepts any standard weight/volume format (we handle all unit conversions using our `parseSize` function).
3.  Return an empty array (`[]`) if no products are found.
4.  **ABSOLUTELY NO GROUPING. Send a completely flat array of products.** Each size variation of a product *must* be a separate entry in the array.

This specification is designed for direct compatibility with our `dataHandler.tsx` file (which will need to be updated to handle the change), which handles all data processing, grouping, and unit conversions internally.