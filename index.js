import { Agent } from "@openai/agents";

const agent = new Agent({
  name: "Assistant",
  instructions: "You are a helpful assistant.",
});

const result = await run(
    agent,
    "Write a poem about the sea."
);

console.log(result.finalOutput);