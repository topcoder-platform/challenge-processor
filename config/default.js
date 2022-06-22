/**
 * The default configuration file.
 */

module.exports = {
  DISABLE_LOGGING: process.env.DISABLE_LOGGING ? process.env.DISABLE_LOGGING === 'true' : false, // If true, logging will be disabled
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  // Auth0 parameters
  AUTH0_URL: process.env.AUTH0_URL || 'https://topcoder-dev.auth0.com/oauth/token',
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'https://m2m.topcoder-dev.com/',
  TOKEN_CACHE_TIME: process.env.TOKEN_CACHE_TIME || 90,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || '',
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || '',
  AUTH0_PROXY_SERVER_URL: process.env.AUTH0_PROXY_SERVER_URL,

  KAFKA_URL: process.env.KAFKA_URL || 'localhost:9092',
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'challenge-processor',
  // below are used for secure Kafka connection, they are optional
  // for the local Kafka, they are not needed
  KAFKA_CLIENT_CERT: process.env.KAFKA_CLIENT_CERT,
  KAFKA_CLIENT_CERT_KEY: process.env.KAFKA_CLIENT_CERT_KEY,

  RESOURCE_CREATE_TOPIC: process.env.RESOURCE_CREATE_TOPIC || 'challenge.action.resource.create',
  RESOURCE_DELETE_TOPIC: process.env.RESOURCE_DELETE_TOPIC || 'challenge.action.resource.delete',
  CHALLENGE_CREATED_TOPIC: process.env.CHALLENGE_CREATED_TOPIC || 'challenge.notification.create',

  CHALLENGE_API_URL: process.env.CHALLENGE_API_URL || 'http://api.topcoder-dev.com/v5/challenges',
  RESOURCE_API_URL: process.env.RESOURCE_API_URL || 'http://api.topcoder-dev.com/v5/resources',

  SUBMITTER_ROLE_ID: process.env.SUBMITTER_ROLE_ID || '732339e7-8e30-49d7-9198-cccf9451e221',
  COPILOT_ROLE_ID: process.env.SUBMITTER_ROLE_ID || 'cfe12b3f-2a24-4639-9d8b-ec86726f76bd',
  DATA_SCIENCE_MANAGER_HANDLES: process.env.DATA_SCIENCE_MANAGER_HANDLES ? process.env.DATA_SCIENCE_MANAGER_HANDLES.split(',') : ['ketzjs09', 'Dilhani.Gunawardhana', 'Oanh.Tran', 'sdguntcqa', 'sdgun', 'jcori'],
  DATA_SCIENCE_ROLE_ID: process.env.DATA_SCIENCE_ROLE_ID || '0e9c6879-39e4-4eb6-b8df-92407890faf1'
}
