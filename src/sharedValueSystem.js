// action set
const actions = ['drive_A', 'wait_A', 'drive_B', 'wait_B']

// action-to-consequence mappings
// consequences := ['crash', 'wait 0', 'wait 10', 'wait forever']
const actionsToConsequence = {
  A: actions => {
    if (actionCombinationImpossible(actions)) {
      return null
    } else if (actions.include('drive_A') && actions.include('drive_B')) {
      return 'crash'
    } else if (actions.include('drive_A') && actions.include('wait_B')) {
      return 'wait 0'
    } else if (actions.include('wait_A') && actions.include('wait_B')) {
      return 'wait forever'
    } else {
      return 'wait 10'
    }
  },
  B: actions => {
    if (actionCombinationImpossible(actions)) {
      return null
    } else if (actions.include('drive_A') && actions.include('drive_B')) {
      return 'crash'
    } else if (actions.include('drive_A') && actions.include('wait_B')) {
      return 'wait 0'
    } else if (actions.include('wait_A') && actions.include('wait_B')) {
      return 'wait forever'
    } else {
      return 'wait 10'
    }
  }
}

// consequence quantification
const quantifyConsequence = consequence => {
  switch (consequence) {
    case 'crash':
      return -Infinity
    case 'wait 0':
      return 1 / 2
    case 'wait 10':
      return 1 / 3
    case 'wait forever':
      return 0
    default:
      return null
  }
}

// utility functions
const utilityFunctions = {
  A: actions => quantifyConsequence(actionsToConsequence.A(actions)),
  B: actions => quantifyConsequence(actionsToConsequence.B(actions))
}

// acceptability rules
const acceptabilityRules = [
  actions => {
    if (actionCombinationImpossible(actions)) {
      return null
    } else if (
      (actions.include('drive_A') && actions.include('drive_B')) ||
      (actions.include('drive_A') && actions.include('drive_B'))
    ) {
      return false
    } else {
      return true
    }
  }
]

/**
 * Some actions are mutually exclusive.
 * Also, it is not possible for an agent to take no action.
 * This function specifies mutually exclusive actions and
 * checks whether an impossible action combination is provided.
 *
 * @param  {array} actions
 * @returns {boolean}
 */
function actionCombinationImpossible (actions) {
  return (
    actions.length !== 2 ||
    (actions.include('drive_A') && actions.include('wait_A')) ||
    (actions.include('drive_B') && actions.include('wait_B'))
  )
}

module.exports = {
  actions,
  utilityFunctions,
  acceptabilityRules
}
