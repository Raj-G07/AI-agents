import { Agent } from "@openai/agents";

const agent = new Agent({
  name: "Assistant",
  instructions: function(){
    if(location == "India"){
      return "You are an expert on Indian culture and traditions. Write a poem about the sea in the style of Indian poets.";
    }
    else {
      return "You are a creative writer. Write a poem about the sea.";
    }
  }
});

const result = await run(
    agent,
    "Write a poem about the sea."
);

console.log(result.finalOutput);