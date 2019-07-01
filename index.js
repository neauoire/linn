const easymidi = require('easymidi')
const serialosc = require('serialosc')

const output = new easymidi.Output('Linn Monome', true)

serialosc.start()

let grid = null

function noteAt (i) {
  return { n: 'C', l: 0 }
}

function posAt (i) {
  return { x: i % 16, y: Math.floor(i / 16) }
}

function idAt (x, y) {
  return (y * 16) + x
}

function initDevice () {
  for (let i = 0; i < 128; i++) {
    const pos = posAt(i)
    const light = noteAt(i).l
    grid.set(pos.x, pos.y, light)
  }
}

function selectDevice (device) {
  grid = device
  grid.all(0)
  grid.on('key', onKey)
  console.log('Selected: ' + device.model)
  initDevice()
}

function onKey (data) {
  if (data.s === 1) { onKeyDown(data.x, data.y) } else { onKeyUp(data.x, data.y) }
}

function onKeyDown (x, y) {
  const note = noteAt(idAt(x, y))
  console.log(note)
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
