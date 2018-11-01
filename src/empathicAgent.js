/*
* Generic empathic agent module
*/
const _ = require('underscore')

const { determineNash, argmax, determinePowerSet, getKeysWithMaxValue } = require('./utils')

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
 * @returns {array} actions to execute
 */
const determineActionsNaive = () => {

}

/**
 * Determine actions, lazy empathic agent
 *
 * @returns {array} actions to execute
 */
const determineActionsLazy = () => {

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

module.exports = { runFullUtilityFunction, determineActionsFull }
