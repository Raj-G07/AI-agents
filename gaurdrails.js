import {Agent,run} from "@openai/agents";
import {z} from "zod";
const mathInputAgent = new Agent({
    name: "Math Input Agent",
    description: "An agent that determines if the input is related to math homework.",
    outputType: z.object({
        isMathHomework: z.boolean().describe("Indicates whether the input is related to math homework."),
    }),
});
const mathInputGuardrail = {
    name: "Math Input Guardrail",
    execute: async ({input,context}) => {
        const result = await run(mathInputAgent,input,{context});
        return {
            tripwireTriggered: !result.finalOutput.isMathHomework,
        }
}
}

const mathAgent = new Agent({
    name: "Math Agent",
    description: "An agent that can perform basic arithmetic operations.",
    inputGuardrails: [mathInputGuardrail],

});

async function main(q="") {
    const result = await run(mathAgent, q);
    console.log(result.finalOutput);
}

main("What is 15 multiplied by 3?");