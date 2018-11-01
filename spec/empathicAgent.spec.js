const _ = require('underscore')
const { runFullUtilityFunction, determineActionsFull } = require('../src/empathicAgent')

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
    ).toEqual(-Infinity)
    expect(runFullUtilityFunction(
      utilityFunctions[0], acceptabilityRules, ['A_Bach', 'B_Bach'], 0)
    ).toEqual(1)
  })

  xit('should correctly determine naively empathic actions', () => {
    expect(true).toBe(false)
  })

  xit('should correctly determine lazily empathic actions', () => {
    expect(true).toBe(false)
  })

  it('should correctly determine fully empathic actions', () => {
    const fullEmpathicActions1 =
      determineActionsFull(utilityFunctions, acceptabilityRules, possibleActions, 0)
    expect(_.intersection(fullEmpathicActions1, ['A_Bach']).length)
      .toEqual(fullEmpathicActions1.length)
    const fullEmpathicActions2 =
      determineActionsFull(utilityFunctions, acceptabilityRules, possibleActions, 1)
    expect(_.intersection(fullEmpathicActions2, ['B_Bach']).length)
      .toEqual(fullEmpathicActions2.length)
  })
})
