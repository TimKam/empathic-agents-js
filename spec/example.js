const utilityFunctionsEx = [
  actions => {
    const isImpossible =
      actions.length !== 2 ||
      actions.filter(action => action[0] === 'A').length !== 1 ||
      actions.filter(action => action[0] === 'B').length !== 1
    if (isImpossible) {
      return null
    } else if (actions.includes('A_Bach') && actions.includes('B_Bach')) {
      return 6
    } else if (actions.includes('A_Stravinsky') && actions.includes('B_Stravinsky')) {
      return 5
    } else if (actions.includes('A_Stravinsky') && !actions.includes('B_Stravinsky')) {
      return 4
    } else if (actions.includes('A_Mozart') && actions.includes('B_Mozart')) {
      return 3
    } else {
      return 1
    }
  },
  actions => {
    const isImpossible =
      actions.length !== 2 ||
      actions.filter(action => action[0] === 'A').length !== 1 ||
      actions.filter(action => action[0] === 'B').length !== 1
    if (isImpossible) {
      return null
    } else if (actions.includes('A_Bach') && actions.includes('B_Bach')) {
      return 1.1
    } else if (actions.includes('A_Stravinsky') && actions.includes('B_Stravinsky')) {
      return 2
    } else if (actions.includes('A_Mozart') && actions.includes('B_Mozart')) {
      return 4
    } else {
      return 1
    }
  }
]

const rule = actions => {
  if (actions.includes('B_Stravinsky')) {
    return false
  } else {
    return true
  }
}

const acceptabilityRulesEx = [rule, rule]

const possibleActionsEx = [
  ['A_Bach', 'A_Stravinsky', 'A_Mozart'],
  ['B_Bach', 'B_Stravinsky', 'B_Mozart']
]

module.exports = {
  utilityFunctionsEx,
  acceptabilityRulesEx,
  possibleActionsEx
}
