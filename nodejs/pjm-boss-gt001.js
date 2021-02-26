const maxAPI = require("max-api")

const debounce = require('lodash.debounce')

const patchNames = require('./lib/patch-names')

const DEBUG = false

let currentBank = 0
let currentPatch = 1

// At startup, we get a set-patch-bank and set-patch
// separately, but very close to each other => debounce
const debouncedUpdatePatch = debounce(updatePatch, 50)

maxAPI.addHandler("set-patch-bank", onSetPatchBank)
maxAPI.addHandler("set-patch", onSetPatch)
debug('started')
maxAPI.outlet('started')

function onSetPatchBank(aNumber) {
  debug('set-patch-bank', aNumber)
  currentBank = aNumber
  debouncedUpdatePatch()
}

function onSetPatch(aNumber) {
  debug('set-patch', aNumber)
  currentPatch = aNumber
  debouncedUpdatePatch()
}


function updatePatch() {
  const patchNum = getPatchNum()
  const patchName = getPatchName()
  debug(`updating patch with /${patchNum}/${patchName}`)
  maxAPI.outlet('set-patch-num', 'set', patchNum)
  maxAPI.outlet('set-patch-name', 'set', patchName)
}

function date() {
  return new Date().toISOString()
}

function getPatchNum() {
  let prefix
  let numBase = 0
  switch (currentBank) {
    case 0: prefix = 'P-'; numBase = 0; break
    case 1: prefix = 'P-'; numBase = 100; break
    case 2: prefix = 'U-'; numBase = 0; break
    case 3: prefix = 'U-'; numBase = 100; break
  }

  const patchNum = `${numBase + currentPatch}`.padStart(3, '0')
  return `${prefix}${patchNum}`
}

function getPatchName() {
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