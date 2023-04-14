const Mock = require("../../");
const { equal } = require("assert");

describe("Kafka Adapter", () => {
  it("should register", async () => {
    const kafka = new Mock.Kafka({
      clientId: "test-client-1",
      brokers: ["test"],
    });

    const producer = kafka.producer();
    const consumer = kafka.consumer({ groupId: "test-group-1" });

    await producer.connect();
    await consumer.connect();

    let assert = false;

    await consumer.subscribe({ topic: "test-topic-1" });
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (
          topic === "test-topic-1" &&
          message.value.toString() === "TEST_MESSAGE"
        ) {
          assert = true;
        }
      },
    });

    await producer.send({
      topic: "test-topic-1",
      messages: [{ value: "TEST_MESSAGE" }],
    });

    equal(assert, true);
  });
});
