# Ant Salesman

To run in development mode you'll need:

- [Yarn](https://yarnpkg.com/en/)
- [Electron](https://electronjs.org/)

```
yarn global add electron
yarn install
yarn start
```

Additionally, to compile it you'll need:

- [Electron Packager](https://github.com/electron-userland/electron-packager)

```
yarn global add electron-packager
yarn install
yarn run build
```

The format of the files must be the following (examples can be found on [inputs](./inputs)):

```json
{
  "nodes": [
    [
      1,
      37.5,
      28.1
    ],
    [
      2,
      23,
      29
    ]
  ]
}
```

Where, for each item in the array, `0` is the id or name of the node, `1` is the x coordinate and `2` is the y coordinate.

The traveler salesman problem is assumed to be complete and simetric.
