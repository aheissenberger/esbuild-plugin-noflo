import * as esbuild from 'esbuild'
import * as path from "path";
import { fileURLToPath } from 'url';


import nofloPlugin from 'esbuild-plugin-noflo'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main(options) {
    await esbuild.build(
        {
            entryPoints: [options.wrapper],
            bundle: true,
            minify: options.minify,
            sourcemap: options.sourcemap,
            platform: "node",
            target: "node14",
            outfile: path.join(options.outdir, 'index.js'),

            plugins: [
                nofloPlugin({
                    graph: 'noflotest/ShowContents',
                    debug: true,
                    runtimes: ['noflo-nodejs','noflo']
                })
            ],
        }
    )

}

await main(
    {
        wrapper: path.join(__dirname, 'src', 'index.mjs'),
        minify: false,
        sourcemap: true,
        outdir: path.join(__dirname, 'dist'),
    }
)