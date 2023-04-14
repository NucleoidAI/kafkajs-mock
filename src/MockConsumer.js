let topicMap;

setImmediate(() => (topicMap = require("./mock").topicMap));

class MockConsumer {
  constructor({ id, groupId }) {
    this.connected = false;
    this.id = id;
    this.groupId = groupId;

    if (!this.groupId) {
      throw Error("Missing groupId in config");
    }

    this.connect = async () => {
      this.connected = true;
    };
    this.subscribe = async ({ topic }) => {
      if (!this.connected) {
        throw Error("Consumer is not connected");
      }

      if (topicMap.get(topic)) {
        topicMap.get(topic).push(this);
      } else {
        topicMap.set(topic, [this]);
      }
    };
    this.run = async ({ eachMessage }) => {
      this.eachMessage = eachMessage;
    };
  }
}

module.exports = MockConsumer;
