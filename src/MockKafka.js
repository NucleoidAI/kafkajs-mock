const { v4: uuid } = require("uuid");
const MockConsumer = require("./MockConsumer");
const MockProducer = require("./MockProducer");

class MockKafka {
  constructor({ clientId, brokers }) {
    if (!clientId) {
      throw Error("Missing clientId in config");
    }

    if (brokers[0] !== "test") {
      throw Error("Kafka broker is not configured to 'test'");
    }

    this.consumer = ({ groupId }) => new MockConsumer({ id: uuid(), groupId });
    this.producer = () => new MockProducer({ id: uuid() });
  }
}

module.exports = MockKafka;
