import { getElapsedTime } from '../../src/plugins/globals.plugin.js'
describe('globals functions', function() {
  beforeAll(() => {
    // check if the import worked correctly
    expect(getElapsedTime, 'getElapsedTime').to.be.a('function')
  })
  it('getElapsedTime', function() {
    // 10/09/2020 @ 9:46pm (UTC)
    const date = new Date(1602279977000)
    // 11/10/2020 @ 9:21pm (UTC)
    const dateBase = new Date(1605043264)
    expect(getElapsedTime({ date, dateBase })).to.have.property('unit', 'month')
    expect(getElapsedTime({ date, dateBase })).to.have.property('value', 1)
  })
})