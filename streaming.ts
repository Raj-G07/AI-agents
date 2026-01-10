import { Agent ,run } from "@openai/agents";    

const agent = new Agent({
   name: "Streaming Agent",
   instructions: "An agent that demonstrates streaming responses.",
});

async function main(q:string) {
   const response = await run(agent, q, {stream: true});
   response.toTextStream({compatibleWithNodeStreams: true}).pipe(process.stdout);
//    const stream = response.toTextStream();
//    for await (const chunk of stream) {
//         console.log(chunk);
//    }
}

main("Hello, how can I assist you today?");