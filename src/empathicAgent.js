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
 * @param  {boolean} log
 * @returns {array} actions to execute
 */
const determineActionsNaive = (utilityFunctions, acceptabilityRules, actions, agentIndex, log = true) => {
  setColorTheme(agentIndex)
  if (log) console.log(`Agent ${agentIndex}, running naive empathic agent algorithm.`.agent)
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
  if (log) console.log(`acceptableArgmax, as determined by agent ${agentIndex}: ${JSON.stringify(acceptableArgmax)}`.agent)
  if (acceptableArgmax.length > 0) {
    const determinedActions = _.intersection(acceptableArgmax[0], actions[agentIndex])
    if (log) {
      console.log(`Agent ${agentIndex} found acceptableArgmax.
      Determined action(s): ${JSON.stringify(determinedActions)}`.agent)
    }
    return determinedActions
  } else {
    const sharedUtilityFunction = actions =>
      fullUtilityFunctions[0](actions) * fullUtilityFunctions[1](actions)
    const sharedArgmax = argmax(sharedUtilityFunction, combinedActionSets)
    const determinedActions = _.intersection(actions[agentIndex], sharedArgmax[0])
    if (log) {
      console.log(`Agent ${agentIndex} did not find acceptableArgmax and falls back to maximize shared utility.
      Determined action(s): ${JSON.stringify(determinedActions)}`.agent)
    }
    return determinedActions
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
  console.log(`Agent ${agentIndex}, running lazy empathic agent algorithm.`.agent)
  const fullUtilityFunctions =
    utilityFunctions.map(func => actions => runFullUtilityFunction(
      func, acceptabilityRules, actions)
    )
  const combinedActionSets = actions[0].concat(actions[1])
  const actsMax = argmax(utilityFunctions[agentIndex], combinedActionSets).filter(
    acts => acceptabilityRules.every(rule => rule(acts) === true)
  )
  const goodActsMax = []
  goodActsMax.push(argmax(utilityFunctions[agentIndex], combinedActionSets).filter(acts => {
    const isAcceptable = acceptabilityRules.every(rule => rule(acts) === true)
    const isFeasible =
      utilityFunctions[0](
        [
          ...determineActionsNaive(utilityFunctions, acceptabilityRules, actions, 0, false),
          ...determineActionsNaive(utilityFunctions, acceptabilityRules, actions, 1, false)
        ]) >=
        utilityFunctions[0](actsMax)
    return isAcceptable && isFeasible
  }))
  goodActsMax.push(argmax(utilityFunctions[agentIndex], combinedActionSets).filter(acts => {
    const isAcceptable = acceptabilityRules.every(rule => rule(acts) === true)
    const isFeasible =
      utilityFunctions[1](
        [
          ...determineActionsNaive(utilityFunctions, acceptabilityRules, actions, 0, false),
          ...determineActionsNaive(utilityFunctions, acceptabilityRules, actions, 1, false)
        ]) >=
        utilityFunctions[1](actsMax)
    return isAcceptable && isFeasible
  }))
  console.log(`goodActsMax, as determined by agent ${agentIndex}: ${JSON.stringify(goodActsMax)}`.agent)
  if (_.intersection(goodActsMax[0], goodActsMax[1]).length > 0) {
    const determinedActions = _.intersection(actions[agentIndex], goodActsMax[agentIndex][0])
    console.log(`Agent ${agentIndex} found goodActsMax.
      Determined action(s): ${JSON.stringify(determinedActions)}`.agent)
    return determinedActions
  } else {
    const sharedUtilityFunction = actions =>
      fullUtilityFunctions[0](actions) * fullUtilityFunctions[1](actions)
    const sharedArgmax = argmax(sharedUtilityFunction, combinedActionSets)
    const determinedActions = _.intersection(actions[agentIndex], sharedArgmax[0])
    console.log(`Agent ${agentIndex} did not find goodActsMax and falls back to maximize shared utility.
    Determined action(s): ${JSON.stringify(determinedActions)}`.agent)
    return determinedActions
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
    const determinedActions = _.intersection(actions[agentIndex], sharedMaxEquilibria[0])
    console.log(
      `Shared max equilibria, as determined by agent ${agentIndex}: ${JSON.stringify(sharedMaxEquilibria)}
       Determined action(s): ${JSON.stringify(determinedActions)}`.agent
    )
    return determinedActions
  } else {
    const sharedUtilityFunction = actions =>
      fullUtilityFunctions[0](actions) * fullUtilityFunctions[1](actions)
    const sharedArgmax = argmax(sharedUtilityFunction, combinedActionSets)
    const determinedActions = _.intersection(actions[agentIndex], sharedArgmax[0])
    console.log(
      `Shared argmax, as determined by agent ${agentIndex}: ${JSON.stringify(sharedArgmax)}
       Determined action(s): ${JSON.stringify(determinedActions)}`.agent
    )
    return determinedActions
  }
}

module.exports = {
  runFullUtilityFunction,
  determineActionsNaive,
  determineActionsLazy,
  determineActionsFull
}
