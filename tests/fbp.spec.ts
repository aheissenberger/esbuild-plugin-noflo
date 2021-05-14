import fbpPlugin from '../src/index'
import * as path from 'path'
import * as fsmock from 'mock-fs'


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

    fsmock(
      {
        '/component-loader-example': {
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

  afterEach(() => {
    fsmock.restore();
  });

  it('is minimal pattern', async (doneTest) => {
    const fbpGraph = { "caseSensitive": false, "connections": [{ "src": { "port": "out", "process": "Async" }, "tgt": { "port": "in", "process": "Invert" } }], "groups": [], "inports": { "in": { "port": "in", "process": "Async" } }, "outports": { "out": { "port": "out", "process": "Invert" } }, "processes": { "Async": { "component": "core/RepeatDelayed" }, "Invert": { "component": "component-loader-example/Invert" } } }

    const expected =`module.exports = ${JSON.stringify(fbpGraph, undefined, "\t")};`
    const plugin = fbpPlugin()

    plugin.setup(buildMock('/component-loader-example/graphs/InvertAsync.fbp', (data) => {
      
      expect( eval(data.contents)).toBe(eval(expected))
      doneTest()
    }))

  }, 500000)




})