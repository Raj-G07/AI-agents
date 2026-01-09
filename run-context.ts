import { Agent, run, tool,RunContext } from "@openai/agents";    
import { z } from "zod";    
interface myContext {
    userId: string;
    userName: string;
}

const greetTool = tool({
    name: "greetUser",
    description: "Greets the user by their name.",
    parameters: z.object({ }),
    execute:async (_args, runContext?: RunContext<myContext>): Promise<string> => {
        return `Hello, ${runContext?.context.userName}! Welcome back!`;
    },
});


const agent = new Agent<myContext>({
    name: "ExampleAgent",
    instructions: "You are an example agent that responds to user queries.",
    tools: [greetTool],
});

async function main(q:string, ctx: myContext) {
  const result = await run(agent, q, { context: ctx });
  console.log(result.finalOutput);
}

main("Hello, how can I assist you today?", { userId: "123", userName: "John Doe" });
    // Define your tools here