/** @typedef { import('./types').OnPatchChange } OnPatchChange */
/** @typedef { import('./types').OnIdentityReply } OnIdentityReply */

const midi = require('./midi')

module.exports = {
  getPortName,
  setOnPatchChange,
  setOnIdentityReply,
  setPatch,
  sendIdentityRequest,
}

/** @type { OnPatchChange } */
let onPatchChange = () => {}

/** @type { OnIdentityReply } */
let onIdentityReply = () => {}

/** @type { () => string } */
function getPortName() {
  return midi.getPortName()
}

/** @type { (onPatchChangeArg: OnPatchChange) => void } */
function setOnPatchChange(onPatchChangeArg) {
  onPatchChange = onPatchChangeArg
}

/** @type { (onIdentityReplyArg: OnIdentityReply) => void } */
function setOnIdentityReply(onIdentityReplyArg) {
  onIdentityReply = onIdentityReplyArg
}

function setPatch() {

}

function sendIdentityRequest() {

}

function init() {

}
