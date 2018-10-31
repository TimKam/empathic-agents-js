/*
* Generic empathic agent module
*/
const { determineNash, argmax, determinePowerSet, getKeysWithMaxValue } = require('./utils')

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
 * @returns {array} actions to execute
 */

const determineActionsFull = () => {
  // determine own maximal utility
  // determine other's maximal utility
  // check if conflict exists
  // if conflict: check if action acceptable
  //    if acceptable:
  //      if lazy:
  //        execute actions
  //      else:
  //        check what other agent's actions are, given oneself executes current action set
  //        if: resulting utility of both agents' action sets not optimal
  //            discard current action set;
  //            take potentially next best action set and go to "check if conflict exists"
  //        else:
  //          execute action set
  //    else:
  //      discard current action set;
  //      take potentially next best action set and go to "check if conflict exists"
  //      
  // else:
  //    execute actions best for both parties

}

/**
 * Initiate agent with the following parameters:
 *
 * @param  {string} id
 * @param  {array} utilityMappings
 * @param  {array} acceptabilityRules
 * @param  {array} ownActions
 * @param  {string} type
 * @returns {object} Agent object
 */
const empathicAgent = (id, utilityMappings, acceptabilityRules, ownActions, type) => ({
  id,
  utilityMappings,
  acceptabilityRules,
  determineAction
})

module.exports = empathicAgent
