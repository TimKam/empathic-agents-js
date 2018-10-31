const _ = require('underscore')
/*
 * Generic helper functions
*/

/**
 * Determines all Nash equilibria, for 2 player (agent) scenarios
 *
 * @param  {array} utilityFunctions Utility functions of the agents
 * @param  {array} actionSets Sets of possible actions each agent has (array of arrays, one array per agent)
 * @returns {array} (array of arrays)
*/
function determineNash (utilityFunctions, actionSets) {
  const combinedActionSets = actionSets[0].concat(actionSets[1])
  const equilibria = []
  const actionPowerset = determinePowerSet(combinedActionSets)
  // console.log(`actionPowerset: ${JSON.stringify(actionPowerset)}`)
  actionPowerset.forEach(actionSet => {
    const actionsA = _.intersection(actionSets[0], actionSet)
    const actionsB = _.intersection(actionSets[1], actionSet)
    /* given actionsA, B's best options are actionsB
    given actionsB, A's best options are actionsA */
    // console.log(`actionsA: ${JSON.stringify(actionsA)}`)
    // console.log(`actionsB: ${JSON.stringify(actionsB)}`)
    // console.log(`argmaxB: ${JSON.stringify(argmax(utilityFunctions[1], combinedActionSets, actionsA))}`)
    // console.log(`argmaxA: ${JSON.stringify(argmax(utilityFunctions[0], combinedActionSets, actionsB))}`)
    const isEquilibrium =
      argmax(utilityFunctions[1], combinedActionSets, actionsA).some(
        acts => {
          const actsMaxB = _.intersection(acts, actionSets[1])
          // console.log(`actsMaxB: ${JSON.stringify(actsMaxB)}`)
          // console.log(_.intersection(actionsB, actsMaxB).length)
          return _.intersection(actionsB, actsMaxB).length === actsMaxB.length
        }
      ) &&
      argmax(utilityFunctions[0], combinedActionSets, actionsB).some(
        acts => {
          const actsMaxA = _.intersection(acts, actionSets[0])
          // console.log(`actsMaxA: ${JSON.stringify(actsMaxA)}`)
          // console.log(_.intersection(actionsA, actsMaxA).length)
          return _.intersection(actionsA, actsMaxA).length === actsMaxA.length
        }
      )
    // console.log(`isEquilibrium: ${isEquilibrium}`)
    if (isEquilibrium) {
      equilibria.push(actionSet)
    }
  })
  return equilibria
}

/**
 * Takes a function and an array of arguments and returns an array of arrays with the arguments that
 * maximize the function output.
 *
 * @param  {function} func function, for which argmax should be determined
 * @param  {array} args possible arguments
 * @param  {array} requiredArgs arguments that must be included for action set to be considered (optional)
 * @returns {array} (array of arrays)
 */
function argmax (func, args, requiredArgs = []) {
  const object = {}
  determinePowerSet(args).filter(
    element => requiredArgs.length === _.intersection(requiredArgs, element).length
  ).forEach(element => {
    object[JSON.stringify(element)] = func(element)
  })
  return getKeysWithMaxValue(object).map(element => JSON.parse(element))
}

/**
 * Determines powerset of input array
 *
 * @param  {array} array
 * @returns {array} (array of arrays)
 */
function determinePowerSet (array) {
  return array.reduce(
    (subsets, value) => subsets.concat(
      subsets.map(set => [value, ...set])
    ), [[]]
  )
}
/**
 * Takes and object and returns the keys that have the maximal value
 *
 * @param  {object} object
 * @returns {array}
 */
function getKeysWithMaxValue (object) {
  return Object.keys(object).filter(x => object[x] === Math.max.apply(null, Object.values(object)))
}

module.exports = { determineNash, argmax, determinePowerSet, getKeysWithMaxValue }
