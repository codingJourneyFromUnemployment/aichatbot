import { Response, NonStreamingChoice } from "../types/openrouter";
import axios from "axios";

interface ReplyData {
  reply: string;
}

export async function chatWithDolphin(
  context: string,
  dolphinKey: string
): Promise<ReplyData> {
  if (!context || !dolphinKey) {
    throw new Error("Missing context or API key");
  }

  try {
    const res = await axios.post<Response>(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // model: "cognitivecomputations/dolphin-llama-3-70b",
        model: "cognitivecomputations/dolphin-mixtral-8x22b",
        messages: [
          {
            role: "user",
            content: context,
          },
        ],
        temperature: 1.1,
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

    const replyData: ReplyData = {
      reply,
    };

    return replyData;
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
