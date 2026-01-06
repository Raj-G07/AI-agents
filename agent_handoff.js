import {Agent,tool,run} from "@openai/agents";
import {RECOMMENDED_PROMPT_PREFIX} from "@openai/agents/extensions";
import { z } from "zod";

const refundPolicyTool = tool({
  name: "Refund Policy Tool",
  description: "Provides information about the refund policy based on the user's location.",
  parameters: z.object({  }),
  execute: async ({}) => {
    if(location == "India"){
      return "In India, the refund policy allows customers to return products within 30 days of purchase with a valid receipt. Certain items like electronics and perishables may have different return policies.";
    }
    else {
      return "The refund policy allows customers to return products within 14 days of purchase with a valid receipt. Some items may be non-refundable.";
    }
  },
});

export const refundPolicyAgent = new Agent({
  name: "Customer Support Agent",
  instructions: function(){
    if(location == "India"){
      return "You are a customer support agent specializing in Indian market policies. Use the Refund Policy Tool to provide accurate information about refunds in India.";
    }
    else {
      return "You are a customer support agent. Use the Refund Policy Tool to provide accurate information about refunds.";
    }
  },
  tools: [refundPolicyTool],
});

const availablePlansTool = tool({
    name: "Available Plans Tool",
    description: "Provides information about available subscription plans based on the user's location.",
    parameters: z.object({  }),
    execute: async ({}) => {
      if(location == "India"){
        return "In India, we offer the Basic Plan at ₹499/month, the Standard Plan at ₹999/month, and the Premium Plan at ₹1499/month.";
      }
      else {
        return "We offer the Basic Plan at $9.99/month, the Standard Plan at $19.99/month, and the Premium Plan at $29.99/month.";
      }
}
  });

export const planAgent = new Agent({
    name: "Subscription Plan Agent",
    instructions: function(){
      if(location == "India"){
        return "You are a subscription plan advisor specializing in Indian market offerings. Use the Available Plans Tool to provide accurate information about subscription plans in India.";
      }
      else {
        return "You are a subscription plan advisor. Use the Available Plans Tool to provide accurate information about subscription plans.";
      }
    },
    tools: [availablePlansTool],
  });   

export const receptionAgent = new Agent({
  name: "Reception Agent",
  instructions: `${RECOMMENDED_PROMPT_PREFIX} You are the reception agent for customer support. Greet the user and determine if they need information about refund policies or subscription plans. Direct them to the appropriate agent based on their needs.`,
  handoffDescription: "Direct the user to the Refund Policy Agent for refund-related queries or to the Subscription Plan Agent for subscription plan inquiries.",
  handoffs: [refundPolicyAgent, planAgent],
});


async function main(query = "") {
    const result = await run(
        receptionAgent,
        query
    );
    console.log(result.finalOutput);
    console.log(result.history);
}

main("Can you tell me about the refund policy?");