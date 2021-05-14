import nofloPlugin from '../src/index'
import * as path from 'path'
import * as fsmock from 'mock-fs'
//import * as reqmock from 'mock-require'


const buildMock = (path, cb) => ({
    onLoad: async (para, callback) => {
        const content = await callback({ path })
        cb(content)
    },
    onResolve: async (para, callback) => {
      const content = await callback({ path })
      cb(content)
    }
})

describe('configuration has', () => {

    beforeEach(() => {
        // reqmock('fbp',{ request: function() {
        //     console.log('****** fbp.request called');
        //   }});
        //jest.useFakeTimers('modern').setSystemTime(new Date('2022-01-01').getTime());

        fsmock(
            {
                '/node_modules': fsmock.load(path.resolve(__dirname, '../node_modules')),
                '/noflo/lib/loader/register.js':'',
                '/component-loader-example': {
                    'index.js': 'module.exports = require("noflo");',
                    'package.json': `{
                        "name": "noflo-component-loader-example",
                        "version": "0.1.0",
                        "description": "Example project for using noflo-component-loader with WebPack",
                        "main": "index.js",
                        "scripts": {
                          "build": "webpack"
                        },
                        "license": "MIT",
                        "homepage": "https://github.com/noflo/noflo-component-loader#readme",
                        "devDependencies": {
                      
                      
                        },
                        "nyc": {
                          "include": [
                            "lib/*.js",
                            "*.js"
                          ]
                        },
                        "noflo": {
                          "icon": "bug"
                        },
                        "dependencies": {
                          "noflo": "^1.4.3",
                          "noflo-core": "^0.6.1"
                        }
                      }
                      `,
                    // Recursively loads all node_modules
                    'node_modules': fsmock.load(path.resolve(__dirname, '../node_modules')),

                    'components': {
                        'Invert.js': `
                        const noflo = require('noflo');

                        exports.getComponent = () => {
                        const c = new noflo.Component();
                        c.inPorts.add('in', {
                            datatype: 'boolean',
                        });
                        c.outPorts.add('out', {
                            datatype: 'boolean',
                        });
                        c.process((input, output) => {
                            if (!input.hasData('in')) {
                            return;
                            }
                            const data = input.getData('in');
                            if (data) {
                            output.sendDone(false);
                            return;
                            }
                            output.sendDone(true);
                        });
                        return c;
                        };

                      `},

                    'graphs': {
                        'InvertAsync.fbp': `INPORT=Async.IN:IN\nOUTPORT=Invert.OUT:OUT\nAsync(core/RepeatDelayed) OUT -> IN Invert(component-loader-example/Invert)\n`
                    }
                }
            },
            {
                createCwd: true,
                createTmp: true,
            }
        )
    })

    afterEach(()=>{
        fsmock.restore();
        //reqmock.stopAll();
    });

    it('is minimal pattern', async (doneTest) => {
        const setup = {
            graph: 'component-loader-example/InvertAsync',
            baseDir: '/component-loader-example'
        }
        const expected = 
`
// File generated by noflo-component-loader on 2021-05-14T17:55:04.306Z
const baseLoader = require('noflo-component-loader/lib/loader.js');
const sources = {};

exports.setSource = function (loader, packageId, name, source, language, callback) {
  baseLoader.setSource(sources, loader, packageId, name, source, language, callback);
};
exports.getSource = function (loader, name, callback) {
  baseLoader.getSource(sources, loader,  name, callback);
}
exports.getLanguages = baseLoader.getLanguages;

exports.register = function (loader, callback) {
  loader.setLibraryIcon("component-loader-example", "bug");
  loader.registerComponent("component-loader-example", "Invert", require("/component-loader-example/components/Invert.js"));
  loader.registerComponent("component-loader-example", "InvertAsync", require("/component-loader-example/graphs/InvertAsync.fbp"));
  loader.registerComponent("core", "RepeatDelayed", require("/component-loader-example/node_modules/noflo-core/components/RepeatDelayed.js"));
  loader.registerComponent(null, "Graph", require("/component-loader-example/node_modules/noflo/components/Graph.js"));
  const loaders = [];
  
  baseLoader.registerCustomLoaders(loader, loaders, callback);
};
`

        const plugin = nofloPlugin(setup)

        plugin.setup(buildMock('/noflo/lib/loader/register.js', (data) => {
            expect(data.contents).toBe(expected)
            doneTest()
        }))

    })

  


})