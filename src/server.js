/*
 * Web socket server that relays any message it receives to all connected clients with the exception of the sender
*/
const WebSocket = require('ws')

const {
  utilityFunctionsVehicles,
  possibleActionsVehicles
} = require('./examples/VehicleExample')

const {
  utilityFunctionsMusic,
  possibleActionsMusic
} = require('./examples/MusicExample')

const port = '8081'
const wss = new WebSocket.Server({ port })

let scenarioType
const clientsConnected = []
const actionSetsReceived = []

console.log(`Starting environment server at port ${port}...`)

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received: ${message}`)
    const jMessage = JSON.parse(message)
    if (Object.keys(jMessage)[0] === 'requestScenarioInfo') {
      const scenarioInfo = jMessage.requestScenarioInfo
      clientsConnected.push(scenarioInfo.agentId)
      ws.id = scenarioInfo.agentId
      scenarioType = scenarioInfo.scenarioType
      if (scenarioInfo.scenarioType === 'vehicles') {
        ws.send(JSON.stringify({
          init: {
            possibleActions: possibleActionsVehicles
          }
        }))
      } else {
        ws.send(JSON.stringify({
          init: {
            possibleActions: possibleActionsMusic
          }
        }))
      }
      if (clientsConnected.length === 2) {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              'start': 'start'
            }))
          }
        })
      }
    }
    if (Object.keys(jMessage)[0] === 'announceActions') {
      const actionObject = jMessage.announceActions
      actionSetsReceived.push(actionObject)
      if (actionSetsReceived.length === 2) {
        const actionArrays = actionSetsReceived
          .map(object => object.actions)
        let actions = []
        actionArrays.forEach(arr => (actions = actions.concat(arr)))
        wss.clients.forEach(client => {
          console.log(`Announce utility to client: ${JSON.stringify(client.id)}`)
          if (client.readyState === WebSocket.OPEN) {
            let utility
            if (scenarioType === 'vehicles') {
              utility = utilityFunctionsVehicles[client.id](actions)
            } else {
              utility = utilityFunctionsMusic[client.id](actions)
            }
            console.log(`Actions: ${JSON.stringify(actions)}; utility: ${utility}`)
            if (utility === Infinity) utility = 'Infinity'
            if (utility === -Infinity) utility = '-Infinity'
            client.send(JSON.stringify({
              utility,
              actions
            }))
          }
        })
        scenarioType = null
        clientsConnected.length = 0
        actionSetsReceived.length = 0
      }
    }
  })
})
