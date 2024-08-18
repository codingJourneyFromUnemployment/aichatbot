import { Response, NonStreamingChoice } from "../types/openrouter";

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
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${dolphinKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "cognitivecomputations/dolphin-mixtral-8x22b",
          messages: [
            {
              role: "user",
              content: context,
            },
          ],
          temperature: 1.15,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as Response;

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenRouter API");
    }

    const firstChoice = data.choices[0] as NonStreamingChoice;
    const reply = firstChoice.message.content;

    if (!reply) {
      throw new Error("No reply from OpenRouter API");
    }

    return { reply };
  } catch (error) {
    console.error("Error in chatWithDolphin:", error);
    throw new Error(
      `API request failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
