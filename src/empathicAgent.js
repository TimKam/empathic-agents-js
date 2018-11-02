/*
* Generic empathic agent module
*/
const _ = require('underscore')
const colors = require('colors')

const { determineNash, argmax } = require('./utils')

/**
 * Sets the color of the console output, based on the agentIndex
 *
 * @param  {number} agentIndex
 */
const setColorTheme = agentIndex => {
  if (agentIndex === 0) {
    colors.setTheme({
      agent: ['cyan']
    })
  } else {
    colors.setTheme({
      agent: ['magenta']
    })
  }
}
/**
 * Construct and run full utility function
 *
 * @param  {function} utilityFunction
 * @param  {array} acceptabilityRules
 * @param  {array} actions
 *
 * @returns {array} actions to execute
 */
const runFullUtilityFunction = (utilityFunction, acceptabilityRules, actions) => {
  const isAcceptable = acceptabilityRules.every(acc => acc(actions))
  if (isAcceptable) {
    return utilityFunction(actions)
  } else {
    return null
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
  setColorTheme(agentIndex)
  const fullUtilityFunctions =
    utilityFunctions.map(func => actions => runFullUtilityFunction(
      func, acceptabilityRules, actions)
    )
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
      fullUtilityFunctions[0](actions) * fullUtilityFunctions[1](actions)
    const sharedArgmax = argmax(sharedUtilityFunction, combinedActionSets)
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
  setColorTheme(agentIndex)
  const fullUtilityFunctions =
    utilityFunctions.map(func => actions => runFullUtilityFunction(
      func, acceptabilityRules, actions)
    )
  const combinedActionSets = actions[0].concat(actions[1])
  const actsMax = argmax(utilityFunctions[agentIndex], combinedActionSets).filter(
    acts => acceptabilityRules.every(rule => rule(acts) === true)
  )
  const goodActsMax = argmax(utilityFunctions[agentIndex], combinedActionSets).filter(acts => {
    const isAcceptable = acceptabilityRules.every(rule => rule(acts) === true)
    const isFeasible1 =
      utilityFunctions[0](
        [
          ...determineActionsNaive(utilityFunctions, acceptabilityRules, actions, 0),
          ...determineActionsNaive(utilityFunctions, acceptabilityRules, actions, 1)
        ]) >=
        utilityFunctions[0](actsMax)
    const isFeasible2 =
      utilityFunctions[1](
        [
          ...determineActionsNaive(utilityFunctions, acceptabilityRules, actions, 0),
          ...determineActionsNaive(utilityFunctions, acceptabilityRules, actions, 1)
        ]) >=
        utilityFunctions[1](actsMax)
    return isAcceptable && isFeasible1 && isFeasible2
  })
  if (goodActsMax.length > 0) {
    return _.intersection(actions[agentIndex], goodActsMax[0])
  } else {
    const sharedUtilityFunction = actions =>
      fullUtilityFunctions[0](actions) * fullUtilityFunctions[1](actions)
    const sharedArgmax = argmax(sharedUtilityFunction, combinedActionSets)
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
  setColorTheme(agentIndex)
  console.log(`Agent ${agentIndex}, running full empathic agent algorithm.`.agent)
  const combinedActionSets = actions[0].concat(actions[1])
  const fullUtilityFunctions =
    utilityFunctions.map(func => actions => runFullUtilityFunction(
      func, acceptabilityRules, actions)
    )
  const equilibria = determineNash(fullUtilityFunctions, actions)
  console.log(`Equilibria, as determined by agent ${agentIndex}: ${JSON.stringify(equilibria)}`.agent)
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
      fullUtilityFunctions[0](actions) * fullUtilityFunctions[1](actions)
    const sharedArgmax = argmax(sharedUtilityFunction, combinedActionSets)
    console.log(
      `Shared argmax, as determined by agent ${agentIndex}: ${JSON.stringify(sharedArgmax)}`.agent
    )
    return _.intersection(actions[agentIndex], sharedArgmax[0])
  }
}

module.exports = {
  runFullUtilityFunction,
  determineActionsNaive,
  determineActionsLazy,
  determineActionsFull
}
