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
  if (challenge.legacy.pureV5 || challenge.legacy.pureV5Task) {
    logger.info('Ignore challenge as it is pureV5 or pureV5Task')
    return
  }
  const challengeTaskInformation = _.get(challenge, 'task', { isTask: false, isAssigned: false, memberId: null })
  if (challengeTaskInformation.isTask) {
    if (memberId) {
      challengeTaskInformation.isAssigned = true
      challengeTaskInformation.memberId = memberId
    } else {
      challengeTaskInformation.isAssigned = false
      challengeTaskInformation.memberId = null
    }
    await helper.patchRequest(`${config.CHALLENGE_API_URL}/${challengeId}`, { task: challengeTaskInformation }, m2mToken)
    logger.info(`Task updated for id ${challengeId} ${JSON.stringify(challengeTaskInformation)}!`)
  }
}

/**
 * Update challenge self service copilot
 * @param {String} challengeId the challenge UUID
 * @param {String} selfServiceCopilot the member hadnle
 */
async function updateSelfServiceCopilot (challengeId, selfServiceCopilot) {
  const m2mToken = await helper.getM2MToken()
  const response = await helper.getRequest(`${config.CHALLENGE_API_URL}/${challengeId}`, m2mToken)
  const challenge = _.get(response, 'body', {})
  if (!challenge.legacy.selfService) {
    logger.info('Ignore challenge as it is not self-service')
    return
  }

  await helper.patchRequest(`${config.CHALLENGE_API_URL}/${challengeId}`, { legacy: { ...challenge.legacy, selfServiceCopilot } }, m2mToken)
  logger.info(`Self service updated for id ${challengeId}! Copilot set to ${selfServiceCopilot}`)
}

/**
 * Update challenge self service data science manager
 * @param {String} challenge The challenge
 */
async function updateSelfServiceDataScienceManager (challenge) {
  if (challenge.legacy.selfService && challenge.tags.includes('Data Science')) {
    const m2mToken = await helper.getM2MToken()
    await helper.postRequest(`${config.RESOURCE_API_URL}/${challenge.id}`, { challengeId: challenge.id, memberHandle: config.DATA_SCIENCE_MANAGER_HANDLE, roleId: config.DATA_SCIENCE_ROLE_ID }, m2mToken)
  }
}

/**
 * Handle create resource message.
 * This will check if a member has registered on a task
 * and will update the task information on the challenge object
 * @param {Object} message the create resource message
 */
async function createResource (message) {
  if (message.payload.roleId === config.SUBMITTER_ROLE_ID) {
    await updateTaskInformation(message.payload.challengeId, message.payload.memberId)
  } else if (message.payload.roleId === config.COPILOT_ROLE_ID) {
    await updateSelfServiceCopilot(message.payload.challengeId, message.payload.memberHandle)
  } else {
    logger.info(`Ignoring message as role ${message.payload.roleId} is not Submitter`)
  }
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
      memberHandle: Joi.string().required(),
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
  if (message.payload.roleId === config.SUBMITTER_ROLE_ID) {
    await updateTaskInformation(message.payload.challengeId, null)
  } else if (message.payload.roleId === config.COPILOT_ROLE_ID) {
    await updateSelfServiceCopilot(message.payload.challengeId, null)
  } else {
    logger.info(`Ignoring message as role ${message.payload.roleId} is not Submitter`)
  }
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

/**
 * Handle create challenge message.
 * and will create the data science manager resource
 * @param {Object} message the create challenge message
 */
 async function handleChallengeCreation (message) {
  await updateSelfServiceDataScienceManager(message.payload)
}

handleChallengeCreation.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      id: Joi.string().required(),
      tags: Joi.array(Joi.string()),
      legacy: Joi.object().keys({
        selfService: Joi.boolean()
      }).required()
    }).unknown(true).required()
  }).required()
}

module.exports = {
  createResource,
  deleteResource,
  handleChallengeCreation
}

logger.buildService(module.exports)
