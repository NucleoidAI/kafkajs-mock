const Mock = require("../../");
const { equal } = require("assert");

const kafka = new Mock.Kafka({
  clientId: "test-client-1",
  brokers: ["test"],
});

describe("Mock Kafka", () => {
  it("sends and receives message", async () => {
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
  it("sends message to 2 consumers with different groupIds", async () => {
    const producer = kafka.producer();
    const consumer1 = kafka.consumer({ groupId: "test-group-1" });
    const consumer2 = kafka.consumer({ groupId: "test-group-2" });

    await producer.connect();
    await consumer1.connect();
    await consumer2.connect();

    let assert1 = false;
    let assert2 = false;

    await consumer1.subscribe({ topic: "test-topic-1" });
    await consumer2.subscribe({ topic: "test-topic-1" });

    await consumer1.run({
      eachMessage: async ({ topic, message }) => {
        if (
          topic === "test-topic-1" &&
          message.value.toString() === "TEST_MESSAGE"
        ) {
          assert1 = true;
        }
      },
    });
    await consumer2.run({
      eachMessage: async ({ topic, message }) => {
        if (
          topic === "test-topic-1" &&
          message.value.toString() === "TEST_MESSAGE"
        ) {
          assert2 = true;
        }
      },
    });

    await producer.send({
      topic: "test-topic-1",
      messages: [{ value: "TEST_MESSAGE" }],
    });

    equal(assert1, true);
    equal(assert2, true);
  });
});
