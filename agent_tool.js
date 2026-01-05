import { Agent,tool,run } from "@openai/agents";
import axios from "axios";
import { z } from "zod";

const weatherLocationTool = tool({
    name: "get_weather_location",
    description: "Get the user's current location.",
    parameters: z.object({
        city: z.string()
    }),
    execute: async ({ city }) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.lower()}&appid=YOUR_API_KEY`;
        const response = axios.get(url,{responseType: 'text'});
        return `The weather of ${city} is ${response.data}.`;
    }
});

const outputSchema = z.object({
    city: z.string().describe("The city to get the weather for"),
    degree_C: z.number().describe("The temperature in Celsius"),
    condition: z.string().describe("The weather condition description")
})

const sendEmailTool = tool({
    name: "send_email",
    description: "Send an email to a specified recipient.",
    parameters: z.object({
        to: z.string().describe("The recipient's email address"),
        subject: z.string().describe("The subject of the email"),
        body: z.string().describe("The body content of the email")
    }),
    execute: async ({ to, subject, body }) => {
        // Simulate sending an email
        return `Email sent to ${to} with subject "${subject}" and body "${body}".`; 
    }
});

const agent = new Agent({
    name: "Weather Assistant",
    instructions: "You are an expert on global weather patterns. Provide accurate and detailed weather forecasts based on the user's location.",
    tools: [weatherLocationTool, sendEmailTool],
    outputType: outputSchema
})

async function main(query = ''){
    const result = await run(
        agent,
        `Provide the weather forecast for the following location: ${query}`
    );
    console.log(result.finalOutput);
}

main("What is the weather in New Delhi?");