const easymidi = require('easymidi')
const serialosc = require('serialosc')

const output = new easymidi.Output('Linn Monome', true)

serialosc.start()

let grid = null

let keys = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B']

let notes = [
  'F3', 'F3#', 'G3', 'G3#', 'A3', 'A3#', 'B3', 'C4', 'C4#', 'D4', 'D4#', 'E4', 'F4', 'F4#', 'G4', 'G4#',
  'C3', 'C3#', 'D3', 'D3#', 'E3', 'F3', 'F3#', 'G3', 'G3#', 'A3', 'A3#', 'B3', 'C4', 'C4#', 'D4', 'D4#',
  'G2', 'G2#', 'A2', 'A2#', 'B2', 'C3', 'C3#', 'D3', 'D3#', 'E3', 'F3', 'F3#', 'G3', 'G3#', 'A3', 'A3#',
  'D2', 'D2#', 'E2', 'F2', 'F2#', 'G2', 'G2#', 'A2', 'A2#', 'B2', 'C3', 'C3#', 'D3', 'D3#', 'E3', 'F3',
  'A1', 'A1#', 'B1', 'C3', 'C2#', 'D2', 'D2#', 'E2', 'F2', 'F2#', 'G2', 'G2#', 'A2', 'A2#', 'B2', 'C3',
  'E1', 'F1', 'F1#', 'G1', 'G1#', 'A1', 'A1#', 'B1', 'C2', 'C2#', 'D2', 'D2#', 'E2', 'F2', 'F2#', 'G2',
  'B0', 'C1', 'C1#', 'D1', 'D1#', 'E1', 'F1', 'F1#', 'G1', 'G1#', 'A1', 'A1#', 'B1', 'C2', 'C2#', 'D2',
  'F0#', 'G0', 'G0#', 'A0', 'A0#', 'B0', 'C1', 'C1#', 'D1', 'E1', 'F1', 'F1#', 'G1', 'G1#', 'A1', 'A1#'
]

function noteAt (i) {
  const n = notes[i]
  const k = n.substr(0, 1)
  const o = parseInt(n.substr(1, 1)) + 2
  const s = n.indexOf('#') > -1
  const l = s ? 0 : k === 'C' ? 15 : 5
  const v = keys.indexOf(k) + (o * 12)
  return { i, k, o, s, l, v }
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
    grid.levelSet(pos.x, pos.y, light)
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
  grid.levelSet(x, y, 10)
  output.send('noteon', { note: note.v, velocity: 127, channel: 3 })
}

function onKeyUp (x, y) {
  const note = noteAt(idAt(x, y))
  grid.levelSet(x, y, note.l)
  output.send('noteoff', { note: note.v, velocity: 127, channel: 3 })
}

serialosc.on('device:add', selectDevice)

process.on('SIGHUP', function () {
  console.log('About to exit')
  output.close()
  process.exit()
})
