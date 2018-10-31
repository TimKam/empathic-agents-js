const _ = require('underscore')
const { determineNash, argmax, determinePowerSet, getKeysWithMaxValue } = require('../src/utils')

describe('determineNash', () => {
  it('Should determine Nash equilibria correctly', () => {
    const actionSets = [['A_Bach', 'A_Stravinsky'], ['B_Bach', 'B_Stravinsky']]
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
          return 2
        } else if (actions.includes('A_Stravinsky') && actions.includes('B_Stravinsky')) {
          return 1
        } else {
          return 0
        }
      }
    ]
    const equilibria = determineNash(utilityFunctions, actionSets)
    console.log(`equilibria: ${JSON.stringify(equilibria)}`);
    [['A_Bach', 'B_Bach'], ['A_Stravinsky', 'B_Stravinsky']].forEach(toBeElement => {
      const isMatch = equilibria.some(
        isElement => _.intersection(isElement, toBeElement).length === isElement.length
      )
      expect(isMatch).toBe(true)
      equilibria.splice(equilibria.indexOf(toBeElement), 1)
    })
  })
})

describe('argmax', () => {
  const func = args => {
    if (args.includes('a')) {
      return 1
    } else if (args.includes('b') && !args.includes('c')) {
      return 2
    } else if (args.includes('c')) {
      return 3
    } else {
      return -10
    }
  }
  const args = ['a', 'b', 'c']
  it('Should determine maximal function arguments correctly', () => {
    const maxArgs = argmax(func, args)
    expect(maxArgs.length).toEqual(2);
    [['c'], ['b', 'c']].forEach(toBeElement => {
      const isMatch = maxArgs.some(
        isElement => _.intersection(isElement, toBeElement).length === isElement.length
      )
      expect(isMatch).toBe(true)
      maxArgs.splice(maxArgs.indexOf(toBeElement), 1)
    })
  })
  it('Should consider required actions correctly', () => {
    const maxArgs = argmax(func, args, ['b'])
    expect(maxArgs.length).toEqual(1);
    [['b', 'c']].forEach(toBeElement => {
      const isMatch = maxArgs.some(
        isElement => _.intersection(isElement, toBeElement).length === isElement.length
      )
      expect(isMatch).toBe(true)
      maxArgs.splice(maxArgs.indexOf(toBeElement), 1)
    })
  })
})

describe('determinePowerSet', () => {
  it('Should determine the power set of an array correctly', () => {
    const arr = ['a', 'b']
    const powerSet = determinePowerSet(arr);
    [[], ['a'], ['b'], ['b', 'a']].forEach(toBeElement => {
      const isMatch = powerSet.some(
        isElement => _.intersection(isElement, toBeElement).length === isElement.length
      )
      expect(isMatch).toBe(true)
      powerSet.splice(powerSet.indexOf(toBeElement), 1)
    })
  })
})

describe('getKeysWithMaxValue', () => {
  it('Should determine the keys of an object that assign the maximum value correctly', () => {
    const obj = { a: 1, b: 2, c: 2 }
    expect(getKeysWithMaxValue(obj)).toEqual(['b', 'c'])
  })
})
