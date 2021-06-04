# Topcoder - Challenge Processor

This microservice processes kafka events related to challenge resources and updates the challenge information

### Development deployment status
[![CircleCI](https://circleci.com/gh/topcoder-platform/challenge-processor/tree/develop.svg?style=svg)](https://circleci.com/gh/topcoder-platform/challenge-processor/tree/develop)
### Production deployment status
[![CircleCI](https://circleci.com/gh/topcoder-platform/challenge-processor/tree/master.svg?style=svg)](https://circleci.com/gh/topcoder-platform/challenge-processor/tree/master)

## Intended use
- Processor

## Prerequisites
-  [NodeJS](https://nodejs.org/en/) (v10)
-  [Kafka](https://kafka.apache.org/)
-  [Docker](https://www.docker.com/)
-  [Docker Compose](https://docs.docker.com/compose/)

## Configuration

Configuration for the processor is at `config/default.js` and `config/production.js`.
The following parameters can be set in config files or in env variables:

- DISABLE_LOGGING: whether to disable logging; default value is false
- LOG_LEVEL: the log level; default value: 'debug'

- AUTH0_URL: Auth0 URL, used to get TC M2M token
- AUTH0_AUDIENCE: Auth0 audience, used to get TC M2M token
- TOKEN_CACHE_TIME: Auth0 token cache time, used to get TC M2M token
- AUTH0_CLIENT_ID: Auth0 client id, used to get TC M2M token
- AUTH0_CLIENT_SECRET: Auth0 client secret, used to get TC M2M token
- AUTH0_PROXY_SERVER_URL: Proxy Auth0 URL, used to get TC M2M token

- KAFKA_URL: comma separated Kafka hosts; default value: 'localhost:9092'
- KAFKA_GROUP_ID: the Kafka group id; default value: 'challenge-processor'
- KAFKA_CLIENT_CERT: Kafka connection certificate, optional; default value is undefined;

if not provided, then SSL connection is not used, direct insecure connection is used;

if provided, it can be either path to certificate file or certificate content

- KAFKA_CLIENT_CERT_KEY: Kafka connection private key, optional; default value is undefined;

if not provided, then SSL connection is not used, direct insecure connection is used;
if provided, it can be either path to private key file or private key content

- RESOURCE_CREATE_TOPIC: create resource Kafka topic, default value is 'challenge.action.resource.create'

- RESOURCE_DELETE_TOPIC: delete resource Kafka topic, default value is 'challenge.action.resource.delete'

- CHALLENGE_API_URL: the Topcoder Challenge API

Also note that there is a `/health` endpoint that checks for the health of the app.
This sets up an expressjs server and listens on the environment variable `PORT`.
It's not part of the configuration file and needs to be passed as an environment variable.
Default health check port is 3000 if not set.

## Local Deployment

### Foreman Setup

To install foreman follow this [link](https://theforeman.org/manuals/1.24/#3.InstallingForeman)
To know how to use foreman follow this [link](https://theforeman.org/manuals/1.24/#2.Quickstart)

### Local Kafka setup
-  `http://kafka.apache.org/quickstart` contains details to setup and manage Kafka server,
below provides details to setup Kafka server in Mac, Windows will use bat commands in bin/windows instead
- download kafka at `https://www.apache.org/dyn/closer.cgi?path=/kafka/1.1.0/kafka_2.11-1.1.0.tgz`
- extract out the doanlowded tgz file
- go to extracted directory kafka_2.11-0.11.0.1
- start ZooKeeper server:
`bin/zookeeper-server-start.sh config/zookeeper.properties`
- use another terminal, go to same directory, start the Kafka server:
`bin/kafka-server-start.sh config/server.properties`
- note that the zookeeper server is at localhost:2181, and Kafka server is at localhost:9092
- use another terminal, go to same directory, create some topics:
`bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic challenge.action.resource.create`

`bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic challenge.action.resource.delete`

- verify that the topics are created:
`bin/kafka-topics.sh --list --zookeeper localhost:2181`,
it should list out the created topics
- run the producer and then write some message into the console to send to the `challenge.action.resource.create` topic:

`bin/kafka-console-producer.sh --broker-list localhost:9092 --topic challenge.action.resource.create`

in the console, write message, one message per line:

`{ "topic": "challenge.action.resource.create", "originator": "topcoder-resources-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "id": "173803d3-019e-4033-b1cf-d7205c7f774c", "challengeId": "9eca62b7-37e9-432c-a2da-50527f110489", "memberId": "40029484", "memberHandle": "jcori", "roleId": "732339e7-8e30-49d7-9198-cccf9451e221" } }`

- optionally, use another terminal, go to same directory, start a consumer to view the messages:

`bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic challenge.action.resource.create --from-beginning`

- writing/reading messages to/from other topics are similar

### Local deployment
- install dependencies `npm i`
- run code lint check `npm run lint`
- fix some code lint errors `npm run lint:fix`
- start processor app `npm start`

### Local Deployment with Docker

To run the Challenge Processor using docker, follow the below steps
1. Navigate to the directory `docker`
4. Once that is done, run the following command
```
docker-compose up
```
5. When you are running the application for the first time, It will take some time initially to download the image and install the dependencies

## Production deployment

- TBD

## Running tests Locally
- TBD

## Verification
Refer to the verification document `Verification.md`

Commit to force redeploy
