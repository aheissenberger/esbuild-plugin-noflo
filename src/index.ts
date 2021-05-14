import discover from './lib/discover'
import serialize from './lib/serialize'
import fbp from 'fbp'
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
    runtimes: ['noflo'],
    discover: true,
    recursive: true,
}

const defaultOptions: optionsI = {
    debug: false,
    manifest: defaultManifest,
    runtimes: defaultManifest.runtimes
}

export function nofloPackage(pkg_options: optionsI = defaultOptions) {
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

        }
    }
}

export function fbpPackage() {

    return {
        name: 'fbp',
        setup(build) {

            build.onResolve({ filter: noflofbpFilter }, args => ({
                path: args.path,
                namespace: 'fbp-graph'
            }))

            build.onLoad({ filter: /.*/, namespace: 'fbp-graph' }, async ({ path }) => {
                const source = await fs.readFile(path, "utf8");
                const fbpGraph:any = fbp.parse(source, {caseSensitive:false})
                return { contents: `module.exports = ${JSON.stringify(fbpGraph.value, undefined, "\t")};` }
            })
        }
    }
}


