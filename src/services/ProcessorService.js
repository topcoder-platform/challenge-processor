/**
 * Service for TC Challenge processor.
 */
const _ = require('lodash')
const Joi = require('joi')
const config = require('config')
const logger = require('../common/logger')
const helper = require('../common/helper')

/**
 * Update challenge task information based on whether a member has registered or unregistered
 * @param {String} challengeId the challenge UUID
 * @param {String} memberId the member ID
 */
async function updateTaskInformation (challengeId, memberId) {
  const m2mToken = await helper.getM2MToken()
  const response = await helper.getRequest(`${config.CHALLENGE_API_URL}/${challengeId}`, m2mToken)
  const challenge = _.get(response, 'body', {})
  const challengeTaskInformation = _.get(challenge, 'task', { isTask: false, isAssigned: false, memberId: null })
  if (challengeTaskInformation.isTask) {
    if (memberId) {
      challengeTaskInformation.isAssigned = true
      challengeTaskInformation.memberId = memberId
    } else {
      challengeTaskInformation.isAssigned = false
      challengeTaskInformation.memberId = null
    }
    await helper.patchRequest(`${config.CHALLENGE_API_URL}/${challengeId}`, challengeTaskInformation, m2mToken)
    logger.info(`Task updated for id ${challengeId} ${JSON.stringify(challengeTaskInformation)}!`)
  }
}

/**
 * Handle create resource message.
 * This will check if a member has registered on a task
 * and will update the task information on the challenge object
 * @param {Object} message the create resource message
 */
async function createResource (message) {
  if (message.payload.roleId !== config.SUBMITTER_ROLE_ID) {
    logger.info(`Ignoring message as role ${message.payload.roleId} is not Submitter`)
    return
  }
  await updateTaskInformation(message.payload.challengeId, message.payload.memberId)
}

createResource.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      challengeId: Joi.string().required(),
      memberId: Joi.string().required(),
      roleId: Joi.string().required()
    }).unknown(true).required()
  }).required()
}

/**
 * Handle create resource message.
 * This will check if a member has registered on a task
 * and will update the task information on the challenge object
 * @param {Object} message the create resource message
 */
async function deleteResource (message) {
  if (message.payload.roleId !== config.SUBMITTER_ROLE_ID) {
    logger.info(`Ignoring message as role ${message.payload.roleId} is not Submitter`)
    return
  }
  await updateTaskInformation(message.payload.challengeId, message.payload.memberId)
}

deleteResource.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      challengeId: Joi.string().required(),
      memberId: Joi.string().required(),
      roleId: Joi.string().required()
    }).unknown(true).required()
  }).required()
}

module.exports = {
  createResource,
  deleteResource
}

logger.buildService(module.exports)
