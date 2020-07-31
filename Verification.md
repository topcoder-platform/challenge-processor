## Verification

- setup kafka server, start processor app
- start kafka-console-producer to write messages to `challenge.action.resource.create` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic challenge.action.resource.create`
- write message:
  `{ "topic": "challenge.action.resource.create", "originator": "topcoder-resources-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "id": "173803d3-019e-4033-b1cf-d7205c7f774c", "challengeId": "9eca62b7-37e9-432c-a2da-50527f110489", "memberId": "40029484", "memberHandle": "jcori", "roleId": "732339e7-8e30-49d7-9198-cccf9451e221" } }`
- You should see a message in the console that the message was processed successsfuly.

- you may write invalid message like:
  `{ "topic": "challenge.action.resource.create", "originator": "topcoder-resources-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "challengeId": "123", "memberHandle": "tester", "roleId": "172803d3-019e-4033-b1cf-d7205c7f774a" } }`

  `{ "topic": "challenge.action.resource.create", "originator": "topcoder-resources-api", "timestamp": "abc", "mime-type": "application/json", "payload": { "id": "173803d3-019e-4033-b1cf-d7205c7f774c", "challengeId": "123", "memberId": "456", "memberHandle": "tester", "roleId": "172803d3-019e-4033-b1cf-d7205c7f774a" } }`

  `{ [ { abc`
- then in the app console, you will see error messages

- start kafka-console-producer to write messages to `challenge.action.resource.delete` topic:
  `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic challenge.action.resource.delete`

- write message to delete data:
  `{ "topic": "challenge.action.resource.delete", "originator": "topcoder-resources-api", "timestamp": "2019-02-16T00:00:00", "mime-type": "application/json", "payload": { "id": "173803d3-019e-4033-b1cf-d7205c7f774c", "challengeId": "9eca62b7-37e9-432c-a2da-50527f110489", "memberId": "40029484", "memberHandle": "jcori", "roleId": "732339e7-8e30-49d7-9198-cccf9451e221" } }`
- You should see a message in the console that the message was processed successsfuly.

- to test the health check API,
  run `export PORT=5000` (default port is 3000 if not set),
  start the processor,
  then browse `http://localhost:5000/health` in a browser,
  and you will see result `{"checksRun":1}`
