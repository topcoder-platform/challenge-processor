/**
 * Contains generic helper methods
 */

const _ = require('lodash')
const config = require('config')
const request = require('superagent')
const m2mAuth = require('tc-core-library-js').auth.m2m
const m2m = m2mAuth(_.pick(config, ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME', 'AUTH0_PROXY_SERVER_URL']))

/**
 * Get Kafka options
 * @return {Object} the Kafka options
 */
function getKafkaOptions () {
  const options = { connectionString: config.KAFKA_URL, groupId: config.KAFKA_GROUP_ID }
  if (config.KAFKA_CLIENT_CERT && config.KAFKA_CLIENT_CERT_KEY) {
    options.ssl = { cert: config.KAFKA_CLIENT_CERT, key: config.KAFKA_CLIENT_CERT_KEY }
  }
  return options
}

/**
 * Get the m2m token
 * @returns {String} the mem token
 */
async function getM2MToken () {
  return m2m.getMachineToken(config.AUTH0_CLIENT_ID, config.AUTH0_CLIENT_SECRET)
}

/**
 * Uses superagent to proxy patch request
 * @param {String} url the url
 * @param {Object} body the body
 * @param {String} m2mToken the m2m token
 * @returns {Object} the response
 */
async function patchRequest (url, body, m2mToken) {
  return request
    .patch(url)
    .send(body)
    .set('Authorization', `Bearer ${m2mToken}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
}

/**
 * Uses superagent to proxy post request
 * @param {String} url the url
 * @param {Object} body the body
 * @param {String} m2mToken the m2m token
 * @returns {Object} the response
 */
async function postRequest (url, body, m2mToken) {
  return request
    .post(url)
    .send(body)
    .set('Authorization', `Bearer ${m2mToken}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
}

/**
 * Uses superagent to proxy get request
 * @param {String} url the url
 * @param {String} m2mToken the M2M token
 * @returns {Object} the response
 */
async function getRequest (url, m2mToken) {
  return request
    .get(url)
    .set('Authorization', `Bearer ${m2mToken}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
}

/**
 * Get project details
 * @param {Number} projectId the project id
 * @returns {Object} project detail
 */
async function getProject (projectId) {
  const token = await getM2MToken()
  const url = `${config.PROJECT_API_BASE}/${projectId}`
  const res = getRequest(url, token)
  if ((res.status || res.statusCode) !== 200) {
    throw new Error(`Failed to get project details of id ${projectId}: ${_.get(res.body, 'message')}`)
  }
  return res.body
}

/**
 * Get member details
 * @param {Number} handle the member handle
 * @returns {Object} member detail
 */
async function getMember (handle) {
  const token = await getM2MToken()
  const url = `${config.MEMBERS_API_BASE}/${handle}`
  const res = getRequest(url, token)
  if ((res.status || res.statusCode) !== 200) {
    throw new Error(`Failed to get member details of handle ${handle}: ${_.get(res.body, 'message')}`)
  }
  return res.body
}

/**
 * Search members of  given ids
 * @param {Array} memberIds  the members ids
 * @returns {Array} searched members
 */
async function searchMembers (memberIds) {
  if (!memberIds || memberIds.length === 0) {
    return []
  }
  const token = await getM2MToken()
  const res = await request
    .get(config.SEARCH_MEMBERS_API_BASE)
    .set('Authorization', `Bearer ${token}`)
    .query({
      fields: 'handle',
      query: _.map(memberIds, id => `userId:${id}`).join(' OR '),
      limit: memberIds.length
    })
    .timeout(config.REQUEST_TIMEOUT)
  const succes = _.get(res.body, 'result.success')
  const status = _.get(res.body, 'result.status')
  if (!succes || !status || status < 200 || status >= 300) {
    throw new Error(`Failed to search members: ${_.get(res.body, 'result.content')}`)
  }
  return _.get(res.body, 'result.content') || []
}

module.exports = {
  getKafkaOptions,
  getM2MToken,
  patchRequest,
  getRequest,
  postRequest,
  getProject,
  getMember,
  searchMembers
}
