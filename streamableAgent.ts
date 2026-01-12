import { Agent, run , MCPServerStreamableHttp } from "@openai/agents";

const githubMcpServer = new MCPServerStreamableHttp({
  name: "github-mcp",
  url: "https://mcp.github.com/openai/codex",
});

const agent = new Agent({
  name: "MCP Hosted Agent",
  instructions: "You must always use the hosted MCP tool to answer questions",
  mcpServers: [githubMcpServer],
});

async function main(q:string) {
  await githubMcpServer.connect();
  const result = await run(agent,q);
  console.log(result.finalOutput);
  await githubMcpServer.close();
}

main("Can you help me with a GitHub-related question?");