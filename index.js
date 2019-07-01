const easymidi = require('easymidi')
const serialosc = require('serialosc')

const output = new easymidi.Output('Linn Monome', true)

serialosc.start()

let grid = null

function selectDevice (device) {
  grid = device
  grid.all(0)
  grid.on('key', onKey)
  console.log('Selected: ' + device.model)
}

function onKey (data) {
  if (data.s === 1) { onKeyDown(data.x, data.y) } else { onKeyUp(data.x, data.y) }
}

function onKeyDown (x, y) {
  grid.set(x, y, 1)
  output.send('noteon', { note: 64, velocity: 127, channel: 3 })
}

function onKeyUp (x, y) {
  grid.set(x, y, 0)
  output.send('noteon', { note: 64, velocity: 127, channel: 3 })
}

serialosc.on('device:add', selectDevice)

process.on('SIGHUP', function () {
  console.log('About to exit')
  output.close()
  process.exit()
})
