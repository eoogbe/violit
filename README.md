# Violit

> An internet forum for discussion

This is a hobby project created purely for my own entertainment.

## Development

### Getting started

Clone the app from github.

To pull the dependencies:

```
yarn
```

To initialize the environment variables, copy `.env.spec` into a file `.env`.
Update the variables to respect your configuration.

To create the database:

```
yarn db:create
```

To migrate the database:

```
yarn migrate:up
```

To seed the database:

```
yarn db:seed
```

### `yarn server`

Runs the development server.

### `yarn start`

Runs the app in the development mode.  
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode. See the section about
[running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

### `yarn guide`

Runs the server for the feature guide.  
Open http://localhost:6060 to view it in the browser.

The page will reload if you make edits to existing files, but you must restart
the server if you add or remove a file.

### `yarn migrate:create [MIGRATION_NAME]`

Creates a database migration file. The up and down files are in
`./migrations/sqls`.

## License

Copyright 2022 Google LLC

[Licensed under the Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

This is not an official Google product.
