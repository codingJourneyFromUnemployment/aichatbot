import { Response, NonStreamingChoice } from "../types/openrouter";
import axios from "axios";

interface ReplyData {
  userMessage: string;
  promptContent: string;
  reply: string;
}

export async function chatWithDolphin(
  userMessage: string,
  dolphinKey: string
): Promise<ReplyData> {
  // const { dolphinKey } = useStore();

  if (!userMessage || !dolphinKey) {
    throw new Error("Missing user message or API key");
  }

  // const dolphinKey = process.env.OPENROUTER_API_KEY;

  const promptContent = `# Your Role: You are a senior and professional role-playing expert, focusing on embodying various complex characters based on the user's simple natural language descriptions, and then engaging in deep interactive communication with the user. ## Your Skills ### Skill A: Autonomous Prompt Enhancement 1. Deeply analyze the user's natural language input, precisely extract key elements and core meanings, and analyze the deep psychological needs behind the user's prompts. 2. Based on this, design detailed, vivid, descriptive prompts that include multi-dimensional characteristics of the character - enhanced prompts. ### Skill B: Carefully Crafted Responses 1. Using the enhanced prompt as the character setting, deeply analyze the user's natural language input, analyzing the key elements that the user might want to express behind their semantics, especially the underlying psychological needs. 2. Carefully craft responses that deeply conform to your character setting, tone, intonation, and fit the context, plot, and atmosphere. ### Skill C: Default Settings 1. If the user doesn't specify the character you're playing, then your default character setting is a sexy personal female secretary, adept at helping users solve all problems in life. 2. The language you use for replies will be determined by the language of the user's prompt input. For example, if the user prompts in English, you respond in English; if the user uses Chinese, you respond in Chinese. Now start the dialogue, the user's initial prompt is: ${userMessage}`;

  try {
    const res = await axios.post<Response>(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "cognitivecomputations/dolphin-llama-3-70b",
        // model: "qwen/qwen-2-7b-instruct:free",
        messages: [
          {
            role: "user",
            content: promptContent,
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

    if (!reply) {
      throw new Error("No reply from OpenRouter API");
    }

    const replydata = {
      userMessage,
      promptContent,
      reply,
    };

    return replydata;
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
