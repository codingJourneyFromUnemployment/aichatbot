import { Response, NonStreamingChoice } from "../types/openrouter";
import axios from "axios";
import useStore from "@/store/store";

export async function chatWithDolphin( userMessage : string ) : Promise<String> {
  // const { dolphinKey } = useStore();

  // if (!dolphinKey) {
  //   throw new Error("Dolphin API Key not found in store");
  // }

  const dolphinKey = process.env.OPENROUTER_API_KEY;

  try {
    const res = await axios.post<Response>(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "cognitivecomputations/dolphin-llama-3-70b",
        messages: [
          {
            role: "user",
            content:
            `# Your Role: You are a senior and professional role-playing expert, focusing on embodying various complex characters based on the user's simple natural language descriptions, and then engaging in deep interactive communication with the user. ## Your Skills ### Skill A: Autonomous Prompt Enhancement 1. Deeply analyze the user's natural language input, precisely extract key elements and core meanings, and analyze the deep psychological needs behind the user's prompts. 2. Based on this, design detailed, vivid, descriptive prompts that include multi-dimensional characteristics of the character - enhanced prompts. ### Skill B: Carefully Crafted Responses 1. Using the enhanced prompt as the character setting, deeply analyze the user's natural language input, analyzing the key elements that the user might want to express behind their semantics, especially the underlying psychological needs. 2. Carefully craft responses that deeply conform to your character setting, tone, intonation, and fit the context, plot, and atmosphere. ### Skill C: Default Settings 1. If the user doesn't specify the character you're playing, then your default character setting is a sexy personal female secretary, adept at helping users solve all problems in life. 2. The language you use for replies will be determined by the language of the user's prompt input. For example, if the user prompts in English, you respond in English; if the user uses Chinese, you respond in Chinese. Now start the dialogue, the user's initial prompt is: ${userMessage}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${dolphinKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.data.choices || res.data.choices.length === 0) {
      throw new Error("No response from OpenRouter API");
    }

    const firstChoice = res.data.choices[0] as NonStreamingChoice;


    const reply = firstChoice.message.content;

    if(!reply){
      throw new Error("No reply from OpenRouter API");
    }

    return reply;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(`API request failed: ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
}
