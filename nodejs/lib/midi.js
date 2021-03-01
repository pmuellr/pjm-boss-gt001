/** @typedef { import('./types').OnMidiMessage } OnMidiMessage */

const midi = require('midi')

module.exports = {
  getPortName,
  sendMessage,
  setOnMessage,
}

const NotFoundPortName = 'not found'
let PortName = NotFoundPortName

const FindPortName = 'GT-001 Ver1-1'
const IPort = new midi.Input()
const OPort = new midi.Output()

/** @type { OnMidiMessage } */
let OnMidiMessageFn = () => {}

// start things up
init()

// -----------------------------------------------------------------------------

/** @type { () => string } */
function getPortName() {
  return PortName
}

/** @type { (message: number[]) => void } */
function sendMessage(message) {
  if (PortName == NotFoundPortName) return

  OPort.sendMessage(message)
}

/** @type { (onMessageArg: OnMidiMessage) => void } */
function setOnMessage(onMessageArg) {
  OnMidiMessageFn = onMessageArg
}

function init() {
  const iPortNum = getMidiPortNumber(FindPortName, IPort)
  const oPortNum = getMidiPortNumber(FindPortName, OPort)

  if (iPortNum < 0 || oPortNum < 0) return

  PortName = FindPortName

  IPort.on('message', (deltaTime, message) => {
    OnMidiMessageFn(deltaTime, message)
  })

  IPort.openPort(iPortNum)
  OPort.openPort(oPortNum)
}

// Would be nice if this function could find the "best" port, which would
// probably be:
// - filter ports by those that include GT-001
// - ensure there is both an input and output port with that name
// - of the remaining posibilities, pick the shortest
// On my mac, I see "GT-001 Ver1-1" and "GT-001 Ver1-1 DAW CTRL", so
// it should pick the first.  I'd also like to use a midi-monitor with
// a virtual port of "GT-001 Debug", which would be the shortest, and
// win, when in use.
/** @type { (name: string, port: any) => number } */
function getMidiPortNumber(name, port) {
  const count = port.getPortCount()
  for (let i = 0; i < count; i++) {
    if (name === port.getPortName(i)) return i
  }
  return -1
}