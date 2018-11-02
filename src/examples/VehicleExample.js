const utilityFunctionsVehicles = [
  actions => {
    const isImpossible =
    actions.length !== 2 ||
    actions.filter(action => action[0] === 'A').length !== 1 ||
    actions.filter(action => action[0] === 'B').length !== 1
    if (isImpossible) {
      return null
    } else if (actions.includes('A_Drive') && actions.includes('B_Wait')) {
      return 1
    } else if (actions.includes('A_Wait') && actions.includes('B_Drive')) {
      return 0.9
    } else if (actions.includes('A_Wait') && actions.includes('B_Wait')) {
      return 0
    } else /* if (actions.includes('A_Drive') && actions.includes('B_Drive')) */ {
      return -Infinity
    }
  },
  actions => {
    const isImpossible =
    actions.length !== 2 ||
    actions.filter(action => action[0] === 'A').length !== 1 ||
    actions.filter(action => action[0] === 'B').length !== 1
    if (isImpossible) {
      return null
    } else if (actions.includes('A_Drive') && actions.includes('B_Wait')) {
      return 0.8
    } else if (actions.includes('A_Wait') && actions.includes('B_Drive')) {
      return 1
    } else if (actions.includes('A_Wait') && actions.includes('B_Wait')) {
      return 0
    } else /* if (actions.includes('A_Drive') && actions.includes('B_Drive')) */ {
      return -Infinity
    }
  }
]

const rule = actions => {
  if ((actions.includes('A_Drive') && actions.includes('B_Drive')) ||
    (actions.includes('A_Wait') && actions.includes('B_Wait'))) {
    return false
  } else if (actions.filter(action => action[0] === 'A').length !== 1 ||
    actions.filter(action => action[0] === 'B').length !== 1) {
    return null
  } else {
    return true
  }
}

const acceptabilityRulesVehicles = [rule, rule]

const possibleActionsVehicles = [
  ['A_Drive', 'A_Wait'],
  ['B_Drive', 'B_Wait']
]

module.exports = {
  utilityFunctionsVehicles,
  acceptabilityRulesVehicles,
  possibleActionsVehicles
}
