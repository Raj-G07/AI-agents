import {Agent,run} from "@openai/agents";
let thread = [];
const conversionAgent = new Agent({
    name: "Unit Conversion Agent",
    description: "An agent that converts units of measurement.",
});

async function main(q="") {
    thread.push({role: "user", content: q});
    const result = await run(conversionAgent, thread);
    thread = result.history;
    console.log(result.finalOutput);
}

main("Convert 10 kilometers to miles.").then(() => {
    main("Now convert 5 miles to kilometers.");
});