
const name = 'Linn Monome'

const readline = require('readline')
const easymidi = require('easymidi')
const serialosc = require('serialosc')

console.log(`Creating ${name}..`)

const output = new easymidi.Output(name, true)

console.log(`Starting serialosc..`)

serialosc.start()

console.log('Waiting..')
console.log('Press any key to stop.')

//

let channel = 1
let grid = null
let fn = false

const keys = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B']

const notes = [
  'F3', 'F3#', 'G3', 'G3#', 'A3', 'A3#', 'B3', 'C4', 'C4#', 'D4', 'D4#', 'E4', 'F4', 'F4#', 'G4', 'G4#',
  'C3', 'C3#', 'D3', 'D3#', 'E3', 'F3', 'F3#', 'G3', 'G3#', 'A3', 'A3#', 'B3', 'C4', 'C4#', 'D4', 'D4#',
  'G2', 'G2#', 'A2', 'A2#', 'B2', 'C3', 'C3#', 'D3', 'D3#', 'E3', 'F3', 'F3#', 'G3', 'G3#', 'A3', 'A3#',
  'D2', 'D2#', 'E2', 'F2', 'F2#', 'G2', 'G2#', 'A2', 'A2#', 'B2', 'C3', 'C3#', 'D3', 'D3#', 'E3', 'F3',
  'A1', 'A1#', 'B1', 'C3', 'C2#', 'D2', 'D2#', 'E2', 'F2', 'F2#', 'G2', 'G2#', 'A2', 'A2#', 'B2', 'C3',
  'E1', 'F1', 'F1#', 'G1', 'G1#', 'A1', 'A1#', 'B1', 'C2', 'C2#', 'D2', 'D2#', 'E2', 'F2', 'F2#', 'G2',
  'B0', 'C1', 'C1#', 'D1', 'D1#', 'E1', 'F1', 'F1#', 'G1', 'G1#', 'A1', 'A1#', 'B1', 'C2', 'C2#', 'D2',
  'F0#', 'G0', 'G0#', 'A0', 'A0#', 'B0', 'C1', 'C1#', 'D1', 'D1#', 'E1', 'F1', 'F1#', 'G1', 'G1#', 'A1'
]

function noteAt (i) {
  const n = notes[i]
  const k = n.substr(0, 1)
  const o = parseInt(n.substr(1, 1)) + 2
  const s = n.indexOf('#') > -1
  const l = s ? 0 : k === 'C' ? 15 : 5
  const p = k + '' + (s ? '#' : '')
  const v = keys.indexOf(p) + (o * 12)
  return { i, k, o, s, l, v, p }
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
  console.log('Ready.')
}

function selectDevice (device) {
  grid = device
  grid.all(0)
  grid.on('key', onKey)
  console.log(`Selecting ${device.model}(${device.sizeX}x${device.sizeY}) ${device.id}..`)
  initDevice()
}

function onKey (data) {
  if (data.s === 1) { onKeyDown(data.x, data.y) } else { onKeyUp(data.x, data.y) }
}

function onKeyDown (x, y) {
  const note = noteAt(idAt(x, y))
  grid.levelSet(x, y, 10)
  output.send('noteon', { note: note.v, velocity: 127, channel: channel })
  console.log(`${(note.i + '').padStart(3, ' ')} | ${(note.p + '').padStart(3, ' ')} | ${(note.v + '').padStart(3, ' ')} | ch:${(channel + '').padStart(3, ' ')}`)
  if (fn && idAt(x, y) < 16) {
    channel = idAt(x, y)
  }
  fn = note.i === 127
}

function onKeyUp (x, y) {
  const note = noteAt(idAt(x, y))
  grid.levelSet(x, y, note.l)
  output.send('noteoff', { note: note.v, velocity: 127, channel: channel })
  fn = false
}

function close () {
  console.log('Done.')
  process.exit()
}

// Ready

serialosc.on('device:add', selectDevice)

// Quit

readline.emitKeypressEvents(process.stdin)

process.stdin.setRawMode(true)

process.stdin.on('keypress', (str, key) => {
  console.log('Closing..')
  grid.all(0)
  output.close()
  setTimeout(close, 1000)
})
