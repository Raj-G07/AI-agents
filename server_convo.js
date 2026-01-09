import {Agent,run} from "@openai/agents";

const conversionAgent = new Agent({
    name: "Unit Conversion Agent",
    description: "An agent that converts units of measurement.",
});

async function main(q="") {
    const result = await run(conversionAgent,{convoId: "conv_w28didididi"}, q);
    console.log(result.finalOutput);
}

main("Convert 10 kilometers to miles.");