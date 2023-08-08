# sget - Simplified Property Getter

`sget` is a lightweight library that provides a convenient and intuitive way to extract values from complex nested data structures using a simplified syntax. With `sget`, you can easily navigate through deeply nested objects and arrays, apply conditional operations, and retrieve values efficiently.

Key Features:
- Navigate through nested objects and arrays using dot and bracket notation.
- Apply conditional operators such as `>`, `>=`, `<`, `<=`, `==`, and `!=` to perform value comparisons.
- Supports wildcard notation for flexible and dynamic property extraction.
- Retrieve multiple properties from a data structure using `sgetAll` function.
- Handle default values for cases where a property is undefined or inaccessible.

Whether you're working with deeply nested JSON structures, configuration objects, or any other complex data, `sget` simplifies the process of extracting specific values with a user-friendly syntax.

## Installation

Install the library using your preferred package manager:

```bash
npm install data-sget
```

# Syntax

Example data:
```javascript
const data = {
    key: { level: 0, index: [0], str: '0' },
    children: [
        {
            key: { level: 1, index: [0, 0], str: '0.0' },
            children: [
                { key: { level: 2, index: [0, 0, 0], str: '0.0.0' }, children: [] },
                { key: { level: 2, index: [0, 0, 1], str: '0.0.1' }, children: [] },
                { key: { level: 2, index: [0, 0, 2], str: '0.0.2' }, children: [] },
                { key: { level: 2, index: [0, 0, 3], str: '0.0.3' }, children: [] },
                { key: { level: 2, index: [0, 0, 4], str: '0.0.4' }, children: [] }
            ]
        },
        {
            key: { level: 1, index: [0, 1], str: '0.1' },
            children: [
                { key: { level: 2, index: [0, 1, 0], str: '0.1.0' }, children: [] },
                { key: { level: 2, index: [0, 1, 1], str: '0.1.1' }, children: [] },
                { key: { level: 2, index: [0, 1, 2], str: '0.1.2' }, children: [] },
                { key: { level: 2, index: [0, 1, 3], str: '0.1.3' }, children: [] },
                { key: { level: 2, index: [0, 1, 4], str: '0.1.4' }, children: [] }
            ]
        },
        {
            key: { level: 1, index: [0, 2], str: '0.2' },
            children: [
                { key: { level: 2, index: [0, 2, 0], str: '0.2.0' }, children: [] },
                { key: { level: 2, index: [0, 2, 1], str: '0.2.1' }, children: [] },
                { key: { level: 2, index: [0, 2, 2], str: '0.2.2' }, children: [] },
                { key: { level: 2, index: [0, 2, 3], str: '0.2.3' }, children: [] },
                { key: { level: 2, index: [0, 2, 4], str: '0.2.4' }, children: [] }
            ]
        },
        {
            key: { level: 1, index: [0, 3], str: '0.3' },
            children: [
                { key: { level: 2, index: [0, 3, 0], str: '0.3.0' }, children: [] },
                { key: { level: 2, index: [0, 3, 1], str: '0.3.1' }, children: [] },
                { key: { level: 2, index: [0, 3, 2], str: '0.3.2' }, children: [] },
                { key: { level: 2, index: [0, 3, 3], str: '0.3.3' }, children: [] },
                { key: { level: 2, index: [0, 3, 4], str: '0.3.4' }, children: [] }
            ]
        },
        {
            key: { level: 1, index: [0, 4], str: '0.4' },
            children: [
                { key: { level: 2, index: [0, 4, 0], str: '0.4.0' }, children: [] },
                { key: { level: 2, index: [0, 4, 1], str: '0.4.1' }, children: [] },
                { key: { level: 2, index: [0, 4, 2], str: '0.4.2' }, children: [] },
                { key: { level: 2, index: [0, 4, 3], str: '0.4.3' }, children: [] },
                { key: { level: 2, index: [0, 4, 4], str: '0.4.4' }, children: [] }
            ]
        }
    ]
};
```

### Query Examples and Results
You can utilize sget to retrieve data from nested structures in a concise manner. The following table demonstrates some query examples and their corresponding results:
```javascript
const result = sget(data, query);
console.log(result);
```


| query                                                                  | result |
|------------------------------------------------------------------------|---------|
| 'children.1.children.2.key.str'                                        | '0.1.2' |
| 'children[3].children[4].key.str'                                      | '0.3.4' |
| 'children..children..key.str'                                          | '0.0.0' |
| 'children[].children[].key.str'                                        | '0.0.0' |
| 'children[.key.str:0.2].key.str'                                       | '0.2' |
| 'children[.children[].key.str:0.3.4].children[.key.index.2:2].key.str' | '0.3.2' |
| 'children[.key.index.1>3].key.str'                                     | '0.4' |
| 'children[.key.index.1>=3].key.str'                                    | '0.3' |
| 'children[.key.index.1>1][.key.index.1<3].key.str'                     | '0.2' |


# Usage
Here are some examples of how to use the library:

```javascript
import sget from 'data-sget';
import {sgetAll} from 'data-sget';

const data = {
    // ...
};

// Example usage of sget
const result1 = sget(data, 'children[.key.str:0.2].key.str');
console.log(result1); // Output: '0.2'

// Example usage of sgetAll
const spmap = {
    first: 'children[.children[].key.str:0.3.4].children[.key.index.2:2].key.str',
    second: 'children[.key.index.1>=3].key.str',
    third: 'children[.key.str:0.2].key.str'
};
const result2 = sgetAll(data, spmap);
console.log(result2.first); // Output: '0.3.2'
console.log(result2.second); // Output: '0.3'
console.log(result2.third); // Output: '0.2'
```

# License
This project is licensed under the MIT License - see the LICENSE file for details.
