// @ts-ignore
const maxAPI = require("max-api")

const debounce = require('lodash.debounce')

const patchNames = require('./lib/patch-names')

const DEBUG = false

let currentBank
let currentPatch

// At startup, we get a set-patch-bank and set-patch
// separately, but very close to each other => debounce
const debouncedUpdatePatch = debounce(updatePatch, 50)

maxAPI.addHandler("set-patch-bank", onSetPatchBank)
maxAPI.addHandler("set-patch", onSetPatch)
debug('started')
maxAPI.outlet('started')
maxAPI.outlet('set-port', 'set', currentBank)


function onSetPatchBank(aNumber) {
  debug('set-patch-bank', aNumber)
  if (aNumber == currentBank) return

  currentBank = aNumber
  debouncedUpdatePatch()
}

function onSetPatch(aNumber) {
  debug('set-patch', aNumber)
  if (aNumber == currentPatch) return

  currentPatch = aNumber
  debouncedUpdatePatch()
}

function updatePatch() {
  currentBank = currentBank || 0
  currentPatch = currentPatch || 0

  const patchNum = getPatchNum()
  const patchName = getPatchName()

  debug(`updating patch with /${currentBank}/${currentPatch}/${patchNum}/${patchName}/`)
  maxAPI.outlet('set-bank', 'set', currentBank)
  maxAPI.outlet('set-patch', 'set', currentPatch)
  maxAPI.outlet('set-patch-num', 'set', patchNum)
  maxAPI.outlet('set-patch-name', 'set', patchName)
  maxAPI.outlet('set-cc', 0, currentBank)
  maxAPI.outlet('set-pc', currentPatch - 1)
}

function getPatchNum() {
  let prefix
  let numBase = 0
  switch (currentBank) {
    case 0: prefix = 'U-'; numBase = 0; break
    case 1: prefix = 'U-'; numBase = 100; break
    case 2: prefix = 'P-'; numBase = 0; break
    case 3: prefix = 'P-'; numBase = 100; break
  }

  const patchNum = `${numBase + currentPatch}`.padStart(3, '0')
  return `${prefix}${patchNum}`
}

function getPatchName() {
  let numBase = 0
  currentBank = currentBank || 0
  currentPatch = currentPatch || 0
  switch (currentBank) {
    case 0: numBase = 0; break
    case 1: numBase = 100; break
    case 2: numBase = 0; break
    case 3: numBase = 100; break
  }

  return patchNames[numBase + currentPatch]
}

function debug(...args) {
  if (!DEBUG) return
  
  const date = new Date().toISOString()
  maxAPI.post(date, ...args)
}