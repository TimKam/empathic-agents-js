/*
* Generic empathic agent module
*/
const _ = require('underscore')

const { determineNash, argmax } = require('./utils')

/**
 * Construct and run full utility function
 *
 * @param  {function} utilityFunction
 * @param  {array} acceptabilityRules
 * @param  {array} actions
 * @param  {number} agentIndex
 *
 * @returns {array} actions to execute
 */
const runFullUtilityFunction = (utilityFunction, acceptabilityRules, actions, agentIndex) => {
  const isAcceptable = acceptabilityRules.every(acc => acc(actions[agentIndex]))
  if (isAcceptable) {
    return utilityFunction(actions)
  } else {
    return -Infinity
  }
}

/**
 * Determine actions, naive empathic agent
 *
 * @param  {array} utilityFunctions
 * @param  {array} acceptabilityRules
 * @param  {array} actions
 * @param  {number} agentIndex
 * @returns {array} actions to execute
 */
const determineActionsNaive = (utilityFunctions, acceptabilityRules, actions, agentIndex) => {
  const combinedActionSets = actions[0].concat(actions[1])
  const acceptableArgmax = argmax(utilityFunctions[agentIndex], combinedActionSets).filter(acts =>
    acceptabilityRules.every(rule =>
      rule(acts) === true
    )
  )
  if (acceptableArgmax.length > 0) {
    return _.intersection(acceptableArgmax[0], actions[agentIndex])
  } else {
    const sharedUtilityFunction = actions =>
      utilityFunctions[0](actions) * utilityFunctions[1](actions)
    const sharedArgmax = argmax(sharedUtilityFunction, actions)
    return _.intersection(actions[agentIndex], sharedArgmax[0])
  }
}

/**
 * Determine actions, lazy empathic agent
 *
 * @param  {array} utilityFunctions
 * @param  {array} acceptabilityRules
 * @param  {array} actions
 * @param  {number} agentIndex
 * @returns {array} actions to execute
 */
const determineActionsLazy = (utilityFunctions, acceptabilityRules, actions, agentIndex) => {
  const combinedActionSets = actions[0].concat(actions[1])
  const actsMax = argmax(utilityFunctions[agentIndex], combinedActionSets).filter(
    acts => acceptabilityRules.every(rule =>
      rule(acts) === true
    )
  )
  const goodActsMax = argmax(utilityFunctions[agentIndex], combinedActionSets).filter(acts => {
    const isAcceptable = acceptabilityRules.every(rule => rule(acts) === true)
    const isFeasible =
      utilityFunctions[agentIndex](
        [
          ...determineActionsNaive(utilityFunctions, acceptabilityRules, actions, 0),
          ...determineActionsNaive(utilityFunctions, acceptabilityRules, actions, 1)
        ]) >=
        utilityFunctions[agentIndex](actsMax)
    return isAcceptable && isFeasible
  })
  if (goodActsMax.length > 0) {
    return _.intersection(actions[agentIndex], goodActsMax[0])
  } else {
    const sharedUtilityFunction = actions =>
      utilityFunctions[0](actions) * utilityFunctions[1](actions)
    const sharedArgmax = argmax(sharedUtilityFunction, actions)
    return _.intersection(actions[agentIndex], sharedArgmax[0])
  }
}

/**
 * Determine actions, full empathic agent
 *
 * @param {array} utilityFunctions
 * @param {array} acceptabilityRules
 * @param {array} actions
 * @param {array} agentIndex
 *
 * @returns {array} actions to execute
 */

const determineActionsFull = (utilityFunctions, acceptabilityRules, actions, agentIndex) => {
  const fullUtilityFunctions =
    utilityFunctions.map(
      (func, index) => actions => runFullUtilityFunction(
        func, acceptabilityRules, actions, index)
    )
  const equilibria = determineNash(utilityFunctions, actions)
  if (equilibria.length > 0) {
    const sharedMaxEquilibria = equilibria.filter(equilibrium =>
      equilibria.every(acts =>
        fullUtilityFunctions[0](acts) * fullUtilityFunctions[1](acts) <=
          fullUtilityFunctions[0](equilibrium) * fullUtilityFunctions[1](equilibrium)
      )
    )
    return _.intersection(actions[agentIndex], sharedMaxEquilibria[0])
  } else {
    const sharedUtilityFunction = actions =>
      utilityFunctions[0](actions) * utilityFunctions[1](actions)
    const sharedArgmax = argmax(sharedUtilityFunction, actions)
    return _.intersection(actions[agentIndex], sharedArgmax[0])
  }
}

module.exports = {
  runFullUtilityFunction,
  determineActionsNaive,
  determineActionsLazy,
  determineActionsFull
}
