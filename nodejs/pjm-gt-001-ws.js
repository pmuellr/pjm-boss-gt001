// @ts-ignore
const maxAPI = require("max-api")

const debounce = require('lodash.debounce')

const patchNames = require('./lib/patch-names')

const DEBUG = true

let currentBank
let currentPatch

maxAPI.addHandler("pjm-gt-001-command", onCommand)
debug('started')
maxAPI.outlet('started')

function onCommand(command) {
  debug('onCommand() - TBD', command)
}

function debug(...args) {
  if (!DEBUG) return
  
  const date = new Date().toISOString()
  maxAPI.post(date, ...args)
}