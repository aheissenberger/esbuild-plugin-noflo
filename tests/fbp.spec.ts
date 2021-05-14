import {fbpPackage as fbpPlugin} from '../src/index'
import * as path from 'path'
import * as fsmock from 'mock-fs'


const buildMock = (path, cb) => ({
    onLoad: async (para, callback) => {
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

    afterEach(()=>{
        fsmock.restore();
    });

    it('is minimal pattern', async (doneTest) => {
        
        const expected = 
`

`

        const plugin = fbpPlugin()

        plugin.setup(buildMock('graphs/InvertAsync.fbp', (data) => {
            expect(data.contents).toBe(expected)
            doneTest()
        }))

    }, 500000)

  


})