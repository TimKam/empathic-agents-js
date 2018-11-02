const _ = require('underscore')

const {
  runFullUtilityFunction,
  determineActionsNaive,
  determineActionsLazy,
  determineActionsFull
} = require('../src/empathicAgent')

const {
  utilityFunctionsEx,
  acceptabilityRulesEx,
  possibleActionsEx
} = require('./example')

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

  it('should execute full example correctly ("integration" test)', () => {
    const naiveEmpathicActionsEx1 =
      determineActionsNaive(utilityFunctionsEx, acceptabilityRulesEx, possibleActionsEx, 0)
    const lazyEmpathicActionsEx1 =
      determineActionsLazy(utilityFunctionsEx, acceptabilityRulesEx, possibleActionsEx, 0)
    const fullEmpathicActionsEx1 =
      determineActionsFull(utilityFunctionsEx, acceptabilityRulesEx, possibleActionsEx, 0)
    const naiveEmpathicActionsEx2 =
      determineActionsNaive(utilityFunctionsEx, acceptabilityRulesEx, possibleActionsEx, 1)
    const lazyEmpathicActionsEx2 =
      determineActionsLazy(utilityFunctionsEx, acceptabilityRulesEx, possibleActionsEx, 1)
    const fullEmpathicActionsEx2 =
      determineActionsFull(utilityFunctionsEx, acceptabilityRulesEx, possibleActionsEx, 1)
    expect(_.intersection(naiveEmpathicActionsEx1, ['A_Bach']).length)
      .toEqual(naiveEmpathicActionsEx1.length)
    expect(_.intersection(naiveEmpathicActionsEx2, ['B_Mozart']).length)
      .toEqual(naiveEmpathicActionsEx2.length)

    expect(_.intersection(lazyEmpathicActionsEx1, ['A_Mozart']).length)
      .toEqual(lazyEmpathicActionsEx1.length)
    expect(_.intersection(lazyEmpathicActionsEx2, ['B_Mozart']).length)
      .toEqual(lazyEmpathicActionsEx2.length)

    expect(_.intersection(fullEmpathicActionsEx1, ['A_Bach']).length)
      .toEqual(fullEmpathicActionsEx1.length)
    expect(_.intersection(fullEmpathicActionsEx2, ['B_Bach']).length)
      .toEqual(fullEmpathicActionsEx2.length)
  })
})
