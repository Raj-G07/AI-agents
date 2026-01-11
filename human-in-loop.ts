import { Agent, run, tool, RunState, RunResult } from "@openai/agents";
import readline from "node:readline/promises";
import fs from "node:fs/promises";
import { z } from "zod";

// Define a tool to get weather information
const getWeather = tool({
  name: "getWeather",
  description: "Get the current weather for a given location",
  parameters: z.object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
  }),
  execute: async ({ location }) => {
    // Simulate fetching weather data
    return `The current weather in ${location} is Sunny, 75°F.`;
  },
});

async function confirm(question: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(`${question} (y/n): `);
  const normalizedAnswer = answer.toLowerCase();
  rl.close();
  return normalizedAnswer === "y" || normalizedAnswer === "yes";
}

const sendEmail = tool({
  name: "sendEmail",
  description: "Send an email to a recipient",
  needsApproval: true,
  parameters: z.object({
    recipient: z.string().describe("The email address of the recipient"),
    subject: z.string().describe("Weather Update"),
    body: z
      .string()
      .describe("The body of the email, including weather information"),
  }),
  execute: async ({ recipient, subject, body }) => {
    // Simulate sending an email
    return `Email sent to ${recipient} with subject "${subject}" and body "${body}".`;
  },
});

const weatherAgent = new Agent({
  name: "WeatherAgent",
  instructions:
    "You are a helpful assistant that provides weather information.",
  tools: [getWeather],
});

async function main(q: string) {
  let result: RunResult<unknown, Agent<unknown, any>> = await run(
    weatherAgent,
    q
  );
  let hasIntrupption = result.interruptions && result.interruptions.length > 0;

  while (hasIntrupption) {
    await fs.writeFile(
      "result.json",
      JSON.stringify(result.state, null, 2),
      "utf8"
    );
    const storedState = await fs.readFile("result.json", "utf-8");
    const state = await RunState.fromString(weatherAgent, storedState);
    for (const interruption of result.interruptions!) {
      const approval = await confirm(
        `Agent ${interruption.agent.name} would like to use the tool ${interruption.name} with "${interruption.arguments}". Do you approve?`
      );
      if (approval) {
        state.approve(interruption);
      } else {
        state.reject(interruption);
      }
    }
    result = await run(weatherAgent, state);
    hasIntrupption = result.interruptions && result.interruptions.length > 0;
  }
  console.log(result.finalOutput);
}

main("What's the weather like in San Francisco?");
