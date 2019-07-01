
const name = 'Linn Monome'
const readline = require('readline')
const easymidi = require('easymidi')
const serialosc = require('serialosc')
const output = new easymidi.Output(name, true)

let channel = 1
let grid = null
let last = null
let down = 0
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

console.log(`Welcome to ${name}, press any key to stop.`)

serialosc.start()

// Utils

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

function redraw () {
  for (let i = 0; i < 128; i++) {
    const pos = posAt(i)
    const note = noteAt(i)
    grid.levelSet(pos.x, pos.y, last && note.p === last ? 10 : note.l)
  }
}

function print (note) {
  console.log(`${(note.i + '').padStart(3, ' ')} | ${(note.p + '').padStart(3, ' ')} | ${(note.v + '').padStart(3, ' ')} | ch:${(channel + '').padStart(3, ' ')}`)
}

function onKeyDown (x, y) {
  const note = noteAt(idAt(x, y))
  down += 1
  grid.levelSet(x, y, 10)
  output.send('noteon', { note: note.v, velocity: 127, channel: channel })
  print(note)
  if (fn && idAt(x, y) < 16) {
    channel = idAt(x, y)
  }
  fn = note.i === 127
  last = note.p
  redraw()
}

function onKeyUp (x, y) {
  const note = noteAt(idAt(x, y))
  down -= 1
  grid.levelSet(x, y, note.l)
  output.send('noteoff', { note: note.v, velocity: 127, channel: channel })
  fn = false
  if (down < 1) {
    last = null
  }
  redraw()
}

function close () {
  console.log('Done.')
  process.exit()
}

// Ready

serialosc.on('device:add', (device) => {
  grid = device
  grid.all(0)
  grid.on('key', (data) => { if (data.s === 1) { onKeyDown(data.x, data.y) } else { onKeyUp(data.x, data.y) } })
  console.log(`Selecting ${device.model}(${device.sizeX}x${device.sizeY}) ${device.id}..`)
  redraw()
})

// Quit

readline.emitKeypressEvents(process.stdin)

process.stdin.setRawMode(true)

process.stdin.on('keypress', (str, key) => {
  console.log('Closing..')
  grid.all(0)
  output.close()
  setTimeout(close, 500)
})
