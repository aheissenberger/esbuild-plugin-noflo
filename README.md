# esbuild-plugin-noflo

This utility can be used for generating statically configured [NoFlo](https://noflojs.org) component loaders when building NoFlo with a [esbuild](https://esbuild.github.io) bundler.
It will replace the default noflo component loader and add support for requiring `.fbp` files.

## Install

    $ npm install --save-dev esbuild-plugin-noflo

## Usage

```js
import esbuild from 'esbuild'
import nofloPlugin from 'esbuild-plugin-noflo'

await esbuild.build(
    {
        entryPoints: ['./test-build-input'],
        outfile: 'test-build-out.js',
        plugins: [
            
            nofloPlugin(
                {
                    // Only include components used by this graph
                    // Set to NULL if you want all installed components
                    graph: 'myproject/GraphName',
                    runtime: ['noflo','noflo-node'] 
                }
            )
        ],
    }
)
```

## Options

### `graph`

Only the components need by this Graph will be included.

Type: `String`
Default: null (all components will be included!)

> **Note:** If you need to support building on Windows, the `test` above must be adapted to the `\` path separator. Use `([\\]+|\/)` instead of `\/`.


### `debug`

Include the original component sources

Type: `Boolean`
Default: false

More info about [esbuild namespaces](https://esbuild.github.io/plugins/#namespaces)

### `baseDIR`

The directory which is the used to search for components.

Type: `String`
Default: `process.cwd()` current directory

### `manifest`

Type: `Object`
Default: {
    runtimes: ['noflo'],
    discover: true,
    recursive: true,
}

### `runtimes`

Type: `Array`
Default: ['noflo']

> **Note:** if you run the result on node and use native libs (e.g. filesystem) you need to add ['noflo','noflo-node'] 

**valid values:**
 * noflo-browser for browser-based components
 * noflo-nodejs for Node.js components
 * noflo-gnome for GNOME desktop components
 * microflo for microcontroller components

[more infos](https://noflojs.org/documentation/publishing/)

## Example Build setup

A complete example on how to create a wrapper to run you graph on the nodejs commandline can be found in the [git repository](https://github.com/aheissenberger/esbuild-plugin-noflo/tree/master/examples).

## Roadmap

 - extract libs from this bundler plugin and from [noflo-component-loader](git://github.com/noflo/noflo-component-loader.git)

## Contribution

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
1. Create your Feature Branch (git checkout -b feature/AmazingFeature)
1. Commit your Changes (git commit -m 'Add some AmazingFeature')
1. Push to the Branch (git push origin feature/AmazingFeature)
1. Open a Pull Request

## Built With

- [microbundle](https://github.com/developit/microbundle)

## License

Distributed under the "bsd-2-clause" License. See [LICENSE.txt](LICENSE.txt) for more information.




