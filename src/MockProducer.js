let topicMap;

setImmediate(() => (topicMap = require("./mock").topicMap));

class MockProducer {
  constructor({ id }) {
    this.connected = false;
    this.id = id;

    this.connect = async () => {
      this.connected = true;
    };
    this.send = async ({ topic, messages }) => {
      if (!this.connected) {
        throw Error("Producer is not connected");
      }

      const consumers = topicMap.get(topic);
      const all = [];

      if (consumers) {
        messages.forEach((message) => {
          consumers.forEach((consumer) => {
            all.push(consumer.eachMessage({ topic, message }));
          });
        });
      }

      await Promise.all(all);
    };
  }
}

module.exports = MockProducer;
