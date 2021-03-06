import discover from './lib/discover'
import serialize from './lib/serialize'
import * as fbp from 'fbp'
import * as fs from 'fs/promises'

type runtimesI = string[]
export type manifestI = {
    runtimes: runtimesI,
    discover: boolean,
    recursive: boolean
}

export type optionsI = {
    debug?: boolean,
    graph?: string,
    baseDir?: string,
    manifest?: manifestI,
    runtimes?: runtimesI
}

const nofloLoaderFilter = /noflo\/lib\/loader\/register.js$/
const noflofbpFilter = /\.fbp$/

const defaultManifest: manifestI = {
    /*
    noflo-browser for browser-based components
    noflo-nodejs for Node.js components
    noflo-gnome for GNOME desktop components
    microflo for microcontroller components
    https://noflojs.org/documentation/publishing/
    */
    runtimes: ['noflo'], // noflo is allways required, but you need to add 'noflo-nodejs' for alle system specific libs!!
    discover: true,
    recursive: true,
}

const defaultOptions: optionsI = {
    debug: false,
    manifest: defaultManifest,
    runtimes: defaultManifest.runtimes
}

export default function nofloPlugin(pkg_options: optionsI = defaultOptions) {
    const options = {
        ...defaultOptions,
        ...pkg_options,
        baseDir: pkg_options?.baseDir ?? process.cwd(),
        manifest: pkg_options?.manifest ?? defaultOptions.manifest
    }

    return {
        name: 'noflo',
        setup(build) {
            build.onLoad({ filter: nofloLoaderFilter }, async (args) => {
                const modules = await discover(options)
                const loader = await serialize(modules, options)
                return { contents: loader }
            })


            // provide loader for `.fbp` files
            build.onResolve({ filter: noflofbpFilter }, args => ({
                path: args.path,
                namespace: 'fbp-graph'
            })
            )

            build.onLoad({ filter: /.*/, namespace: 'fbp-graph' }, async ({ path }) => {
                const source = await fs.readFile(path, "utf8");
                const fbpGraph: any = fbp.parse(source, { caseSensitive: false })
                return { contents: `module.exports = ${JSON.stringify(fbpGraph, undefined, "\t")};` }
            })

        }

    }
}

// export function fbpPlugin() {

//     return {
//         name: 'fbp',
//         setup(build) {

//             build.onResolve({ filter: noflofbpFilter }, args => ({
//                 path: args.path,
//                 namespace: 'fbp-graph'
//             })
//             )

//             build.onLoad({ filter: /.*/, namespace: 'fbp-graph' }, async ({ path }) => {
//                 const source = await fs.readFile(path, "utf8");
//                 const fbpGraph:any = fbp.parse(source, {caseSensitive:false})
//                 return { contents: `module.exports = ${JSON.stringify(fbpGraph, undefined, "\t")};` }
//             })
//         }
//     }
// }


