# Obsidian Dataview Table Cache

Caches tables and their contents to provide it to dataview.

## Usage

```js
dv.pages().map(p => p.tables);

// or

dv.queryTables('"TableFolder"');
```

## Example

A file `Example.md` with the following content:

```markdown
| Ingredient | Amount  |
| ---------- | ------- |
| Milk       | 0.5l    |
| Flour      | 400g    |

^ingredients
```

results in

```js
{
    "path": "Example.md",
    "index": 0,
    "headers": [
        {
            "display": "Ingredient",
            "links": [],
            "isHeader": true,
            "rowIndex": 0,
            "columnIndex": 0
        },
        {
            "display": "Amount",
            "links": [],
            "isHeader": true,
            "rowIndex": 0,
            "columnIndex": 1
        }
    ],
    "rows": [
        [
            {
                "display": "Milk",
                "links": [],
                "isHeader": false,
                "rowIndex": 0,
                "columnIndex": 0
            },
            {
                "display": "0.5l",
                "links": [],
                "isHeader": false,
                "rowIndex": 0,
                "columnIndex": 1
            }
        ],
        [
            {
                "display": "Flour",
                "links": [],
                "isHeader": false,
                "rowIndex": 1,
                "columnIndex": 0
            },
            {
                "display": "400g",
                "links": [],
                "isHeader": false,
                "rowIndex": 1,
                "columnIndex": 1
            }
        ]
    ],
    "alignment": [
        null,
        null
    ],
    "caption": "ingredients"
}
```

## Disclaimer

This plugin is not affiliated with or endorsed by the Obsidian developers.

It is implemented in a hacky way and can break at any time.

## Development

```sh
# install dependencies
npm i

# copy env file and adjust env file if you want automatically copy the plugin to a specified vault
cp .env.example .env

# run dev
npm run dev

# build for release
npm run build
```
