const kafkajs = require("kafkajs");
const MockKafka = require("./MockKafka");

const topicMap = new Map();

kafkajs.Kafka = MockKafka;
module.exports.Kafka = MockKafka;
module.exports.topicMap = topicMap;
