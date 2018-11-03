const _ = require('underscore')

const {
  runFullUtilityFunction,
  determineActionsNaive,
  determineActionsLazy,
  determineActionsFull
} = require('../src/empathicAgent')

const {
  utilityFunctionsMusic,
  acceptabilityRulesMusic,
  possibleActionsMusic
} = require('../src/examples/MusicExample')

const {
  utilityFunctionsVehicles,
  acceptabilityRulesVehicles,
  possibleActionsVehicles
} = require('../src/examples/VehicleExample')

describe('empathicAgent', () => {
  const utilityFunctions = [
    actions => {
      const isImpossible =
      actions.length < 2 ||
      (actions.includes('A_Bach') && actions.includes('A_Stravinsky')) ||
      (actions.includes('B_Bach') && actions.includes('B_Stravinsky'))
      if (isImpossible) {
        return null
      } else if (actions.includes('A_Bach') && actions.includes('B_Bach')) {
        return 1
      } else if (actions.includes('A_Stravinsky') && actions.includes('B_Stravinsky')) {
        return 2
      } else {
        return 0
      }
    },
    actions => {
      const isImpossible =
      actions.length < 2 ||
      (actions.includes('A_Bach') && actions.includes('A_Stravinsky')) ||
      (actions.includes('B_Bach') && actions.includes('B_Stravinsky'))
      if (isImpossible) {
        return null
      } else if (actions.includes('A_Bach') && actions.includes('B_Bach')) {
        return 3
      } else if (actions.includes('A_Stravinsky') && actions.includes('B_Stravinsky')) {
        return 1
      } else {
        return 0
      }
    }
  ]

  const rule = actions => {
    if (actions.includes('A_Stravinsky')) {
      return false
    } else {
      return true
    }
  }

  const acceptabilityRules = [rule, rule]

  const possibleActions = [['A_Bach', 'A_Stravinsky'], ['B_Bach', 'B_Stravinsky']]

  it('should correctly run and construct full utility function', () => {
    expect(runFullUtilityFunction(
      utilityFunctions[0], acceptabilityRules, ['A_Stravinsky', 'B_Stravinsky'], 0)
    ).toEqual(null)
    expect(runFullUtilityFunction(
      utilityFunctions[0], acceptabilityRules, ['A_Bach', 'B_Bach'], 0)
    ).toEqual(1)
  })

  it('should correctly determine naively empathic actions', () => {
    const naivelyEmpathicActions =
      determineActionsNaive(utilityFunctions, acceptabilityRules, possibleActions, 0)
    expect(_.intersection(naivelyEmpathicActions, ['A_Bach']).length)
      .toEqual(naivelyEmpathicActions.length)
    const newRule = actions => true
    const newRules = [newRule, newRule]
    const newNaivelyEmpathicActions1 =
      determineActionsNaive(utilityFunctions, newRules, possibleActions, 0)
    expect(_.intersection(newNaivelyEmpathicActions1, ['A_Stravinsky']).length)
      .toEqual(newNaivelyEmpathicActions1.length)
    const newNaivelyEmpathicActions2 =
      determineActionsNaive(utilityFunctions, newRules, possibleActions, 1)
    expect(_.intersection(newNaivelyEmpathicActions2, ['B_Bach']).length)
      .toEqual(newNaivelyEmpathicActions2.length)
  })

  it('should correctly determine lazily empathic actions', () => {
    const lazilyEmpathicActions =
      determineActionsLazy(utilityFunctions, acceptabilityRules, possibleActions, 0)
    expect(_.intersection(lazilyEmpathicActions, ['A_Bach']).length)
      .toEqual(lazilyEmpathicActions.length)
  })

  it('should correctly determine fully empathic actions', () => {
    const fullEmpathicActions1 =
      determineActionsFull(utilityFunctions, acceptabilityRules, possibleActions, 0)
    const fullEmpathicActions2 =
      determineActionsFull(utilityFunctions, acceptabilityRules, possibleActions, 1)
    expect(_.intersection(fullEmpathicActions1, ['A_Bach']).length)
      .toEqual(fullEmpathicActions1.length)
    expect(_.intersection(fullEmpathicActions2, ['B_Bach']).length)
      .toEqual(fullEmpathicActions2.length)
  })
})

describe('Vehicle example ("integration" test 1)', () => {
  it('It should determine the naively empathic actions correctly', () => {
    const naiveEmpathicActions1 =
      determineActionsNaive(utilityFunctionsVehicles, acceptabilityRulesVehicles, possibleActionsVehicles, 0)
    const naiveEmpathicActions2 =
      determineActionsNaive(utilityFunctionsVehicles, acceptabilityRulesVehicles, possibleActionsVehicles, 1)
    expect(_.intersection(naiveEmpathicActions1, ['A_Drive']).length)
      .toEqual(naiveEmpathicActions1.length)
    expect(_.intersection(naiveEmpathicActions2, ['B_Drive']).length)
      .toEqual(naiveEmpathicActions2.length)
  })

  it('It should determine the lazily empathic actions correctly', () => {
    const lazyEmpathicActions1 =
      determineActionsLazy(utilityFunctionsVehicles, acceptabilityRulesVehicles, possibleActionsVehicles, 0)
    const lazyEmpathicActions2 =
      determineActionsLazy(utilityFunctionsVehicles, acceptabilityRulesVehicles, possibleActionsVehicles, 1)

    expect(_.intersection(lazyEmpathicActions1, ['A_Wait']).length)
      .toEqual(lazyEmpathicActions1.length)
    expect(_.intersection(lazyEmpathicActions2, ['B_Drive']).length)
      .toEqual(lazyEmpathicActions2.length)
  })

  it('It should determine the fully empathic actions correctly', () => {
    const fullEmpathicActions1 =
      determineActionsFull(utilityFunctionsVehicles, acceptabilityRulesVehicles, possibleActionsVehicles, 0)
    const fullEmpathicActions2 =
      determineActionsFull(utilityFunctionsVehicles, acceptabilityRulesVehicles, possibleActionsVehicles, 1)
    expect(_.intersection(fullEmpathicActions1, ['A_Wait']).length)
      .toEqual(fullEmpathicActions1.length)
    expect(_.intersection(fullEmpathicActions2, ['B_Drive']).length)
      .toEqual(fullEmpathicActions2.length)
  })
})

describe('Music example ("integration" test 2)', () => {
  it('It should determine the naively empathic actions correctly', () => {
    const naiveEmpathicActions1 =
      determineActionsNaive(utilityFunctionsMusic, acceptabilityRulesMusic, possibleActionsMusic, 0)
    const naiveEmpathicActions2 =
      determineActionsNaive(utilityFunctionsMusic, acceptabilityRulesMusic, possibleActionsMusic, 1)

    expect(_.intersection(naiveEmpathicActions1, ['A_Bach']).length)
      .toEqual(naiveEmpathicActions1.length)
    expect(_.intersection(naiveEmpathicActions2, ['B_Mozart']).length)
      .toEqual(naiveEmpathicActions2.length)
  })

  it('It should determine the lazily empathic actions correctly', () => {
    const lazyEmpathicActions1 =
      determineActionsLazy(utilityFunctionsMusic, acceptabilityRulesMusic, possibleActionsMusic, 0)
    const lazyEmpathicActions2 =
      determineActionsLazy(utilityFunctionsMusic, acceptabilityRulesMusic, possibleActionsMusic, 1)

    expect(_.intersection(lazyEmpathicActions1, ['A_Mozart']).length)
      .toEqual(lazyEmpathicActions1.length)
    expect(_.intersection(lazyEmpathicActions2, ['B_Mozart']).length)
      .toEqual(lazyEmpathicActions2.length)
  })

  it('It should determine the fully empathic actions correctly', () => {
    const fullEmpathicActions1 =
      determineActionsFull(utilityFunctionsMusic, acceptabilityRulesMusic, possibleActionsMusic, 0)
    const fullEmpathicActions2 =
      determineActionsFull(utilityFunctionsMusic, acceptabilityRulesMusic, possibleActionsMusic, 1)

    expect(_.intersection(fullEmpathicActions1, ['A_Bach']).length)
      .toEqual(fullEmpathicActions1.length)
    expect(_.intersection(fullEmpathicActions2, ['B_Bach']).length)
      .toEqual(fullEmpathicActions2.length)
  })
})
