const maxAPI = require("max-api")

maxAPI.addHandler("text", onText)

function onText(...args) {
  maxAPI.outlet(...args)
}