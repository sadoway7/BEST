# Demonstration of API Interaction Code in src/dataHandler.tsx

This file demonstrates the code from `src/dataHandler.tsx` that is responsible for contacting the WordPress API and fetching product data.

## Code Snippet from `src/dataHandler.tsx`

\`\`\`typescript
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/wp-json/cclist/v1/products');
    if (!response.ok) {
      throw new Error(\`HTTP error! status: ${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product data from WordPress API:", error);
    return [];
  }
};
\`\`\`

## Explanation

This `getAllProducts` function is the **only** part of the application that directly interacts with the WordPress API. Here's a breakdown of how it works:

1.  **\`fetch('/wp-json/cclist/v1/products')\`**:
    -   This line uses the `fetch` API, a standard JavaScript function for making network requests.
    -   It sends a **GET request** to the WordPress API endpoint: \`/wp-json/cclist/v1/products\`.
    -   This endpoint is expected to return a JSON array of product objects, as described in `wordpress_api_data_plan.md`.

2.  **\`await\`**:
    -   The `await` keyword ensures that the code waits for the `fetch` request to complete and the API to respond before proceeding.
    -   This is essential for handling asynchronous operations like network requests.

3.  **\`response.ok\`**:
    -   After the `fetch` request completes, this line checks if the response was successful.
    -   \`response.ok\` is a boolean property that is `true` if the HTTP status code of the response is in the 200-299 range (indicating success), and `false` otherwise (indicating an error).

4.  **\`if (!response.ok) { ... }\`**:
    -   If the response was not successful (e.g., the API endpoint is not found, there's a network error, or the server returns an error status), this code block is executed.
    -   It throws a new `Error` object with a message indicating the HTTP error status. This error will be caught in the `catch` block.

5.  **\`const data = await response.json();\`**:
    -   If the response was successful (\`response.ok\` is `true`), this line proceeds to parse the response body as JSON.
    -   \`response.json()\` is a method that returns a Promise that resolves with the JSON value of the response body.
    -   Again, the `await` keyword ensures that the code waits for the JSON parsing to complete before proceeding.
    -   The parsed JSON data, which is expected to be an array of product objects, is stored in the `data` variable.

6.  **\`return data;\`**:
    -   If everything is successful, the function returns the \`data\` (the array of product objects) as a Promise that resolves with this data.

7.  **\`catch (error) { ... }\`**:
    -   This block handles any errors that might occur during the API request or JSON parsing.
    -   \`console.error("Error fetching product data from WordPress API:", error);\` logs the error to the console for debugging purposes.
    -   \`return [];\` In case of an error, the function returns an **empty array \`[]\`**. This ensures that the application doesn't crash if the API call fails, and it gracefully handles the absence of product data by providing an empty product list.

**In summary, this code snippet clearly demonstrates how `src/dataHandler.tsx` is the *only* module responsible for contacting the WordPress API, fetching product data, handling responses, and managing potential errors.**

Let me know if you have any further questions.