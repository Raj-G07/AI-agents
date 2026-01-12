import { Agent, run, hostedMcpTool } from "@openai/agents";

const agent = new Agent({
  name: "MCP Hosted Agent",
  instructions: "You must always use the hosted MCP tool to answer questions",
  tools: [hostedMcpTool({
    serverLabel: "gitmcp",
    serverUrl: "https://gitmcp.io/openai/codex",
   })],
});


async function main(q:string) {
  const result = await run(agent,q);
  console.log(result.finalOutput);
}

main("Can you provide assistance with a Git-related question?");
    // Define your tools here