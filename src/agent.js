/* Empathic agent client module */
const WebSocket = require('ws')

const {
  determineActionsNaive,
  determineActionsLazy,
  determineActionsFull
} = require('./empathicAgent')

const {
  utilityFunctionsVehicles,
  acceptabilityRulesVehicles
} = require('./examples/VehicleExample')

const {
  utilityFunctionsMusic,
  acceptabilityRulesMusic
} = require('./examples/MusicExample')

const ws = new WebSocket('ws://localhost:8081')

// parse arguments
const args = process.argv.slice(2)

if (args.length !== 3) {
  console.log('Please provide scenario type, agent ID, and agent type.')
  process.exit(1)
}

const scenarioTypes = ['vehicles', 'music']
if (!scenarioTypes.includes(args[0])) {
  console.log(`Please provide one of the following scenario types: ${JSON.stringify(scenarioTypes)}`)
  process.exit(1)
}
const scenarioType = args[0]

const agentIds = [0, 1]
const arg1 = parseInt(args[1])
if (!agentIds.includes(arg1)) {
  console.log(`Please provide one of the following agent IDs: ${JSON.stringify(agentIds)}`)
  process.exit(1)
}
const agentId = arg1

const agentTypes = ['naive', 'lazy', 'full']
if (!agentTypes.includes(args[2])) {
  console.log(`Please provide one of the following scenario types: ${JSON.stringify(agentTypes)}`)
  process.exit(1)
}
const agentType = args[2]

console.log(`Starting agent: ${args}...`)
// handle communication with environment server
ws.on('open', () => {
  ws.send(JSON.stringify(
    { requestScenarioInfo: {
      scenarioType,
      agentId }
    }))
})

let utilityFunctions, acceptabilityRules, possibleActions

ws.on('message', (message) => {
  console.log(`received: ${message}`)
  const jMessage = JSON.parse(message)
  if (Object.keys(jMessage)[0] === 'init') {
    possibleActions = jMessage.init.possibleActions
    if (scenarioType === 'vehicles') {
      utilityFunctions = utilityFunctionsVehicles
      acceptabilityRules = acceptabilityRulesVehicles
    } else {
      utilityFunctions = utilityFunctionsMusic
      acceptabilityRules = acceptabilityRulesMusic
    }
  } else if (Object.keys(jMessage)[0] === 'start') {
    const actions = determineActions(
      agentId,
      agentType,
      utilityFunctions,
      acceptabilityRules,
      possibleActions
    )
    ws.send(JSON.stringify({
      announceActions: {
        actions,
        agentId
      }
    }))
  } else {
    console.log(`
      Actions, as executed by both agents: ${jMessage.actions}
      Receive utility: ${jMessage.utility}`
    )
    process.exit(0)
  }
})

/**
 * Run the agent type's empathic agent algorithm with the corresponding parameters
 *
 * @param  {number} agentId
 * @param  {string} agentType
 * @param  {array} utilityFunctions
 * @param  {array} acceptabilityRules
 * @param  {array} possibleActions
 */
function determineActions (
  agentId,
  agentType,
  utilityFunctions,
  acceptabilityRules,
  possibleActions) {
  console.log('#########')
  console.log(agentType)
  switch (agentType) {
    case 'naive':
      return determineActionsNaive(utilityFunctions, acceptabilityRules, possibleActions, agentId)
    case 'lazy':
      return determineActionsLazy(utilityFunctions, acceptabilityRules, possibleActions, agentId)
    case 'full':
      return determineActionsFull(utilityFunctions, acceptabilityRules, possibleActions, agentId)
    default:
      console.log(`Error: function 'determineActions' called with no agent type specified.`)
      process.exit(1)
  }
}
