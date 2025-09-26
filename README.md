# Obsidian Dataview Table Cache

Caches tables and their contents to provide it to dataview.

## Usage

```js
dv.pages().map(p => p.tables);

// or

dv.queryTable('"TableFolder"');
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
