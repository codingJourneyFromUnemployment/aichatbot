import db from "@/indexedDB/db";
import { Message } from "@/types/indexedDBSchema";
import { Tiktoken, getEncoding } from "js-tiktoken";


const INITIAL_PROMPT =
  "## Your Role: You are a senior and professional role-playing expert, focusing on embodying various complex characters based on the user's simple natural language descriptions, and then engaging in deep interactive communication with the user. ## Your Skills ### Skill A: Autonomous Prompt Enhancement 1. Deeply analyze the user's natural language input, precisely extract key elements and core meanings, and analyze the deep psychological needs behind the user's prompts. 2. Based on this, design detailed, vivid, descriptive prompts that include multi-dimensional characteristics of the character - enhanced prompts. ### Skill B: Carefully Crafted Responses 1. Using the enhanced prompt as the character setting, deeply analyze the user's natural language input, analyzing the key elements that the user might want to express behind their semantics, especially the underlying psychological needs. 2. Carefully craft responses that deeply conform to your character setting, tone, intonation, and fit the context, plot, and atmosphere. ### Skill C: Default Settings 1. If the user doesn't specify the character you're playing, then your default character setting is a sexy personal female secretary, adept at helping users solve all problems in life. 2. The language you use for replies will be determined by the language of the user's prompt input. For example, if the user prompts in English, you respond in English; if the user uses Chinese, you respond in Chinese.";

class ContextManager {
  private initialUserPrompt: string = "";
  private readonly maxTokens: number = 7600;
  private tokenizer: Tiktoken;

  constructor() {
    this.tokenizer = getEncoding("cl100k_base");
  }

  setInitialUserPrompt(prompt: string) {
    this.initialUserPrompt = prompt;
  }

  async getConversationContext(
    conversationId: string,
    latestUserPrompt: string
  ): Promise<string> {
    const messages = await this.getMessages(conversationId);
    const conversationHistory = this.buildConversationHistory(
      messages,
      latestUserPrompt
    );
    return this.assembleContext(conversationHistory);
  }

  private async getMessages(conversationId: string): Promise<Message[]> {
    return db.messages
      .where("conversationId")
      .equals(conversationId)
      .sortBy("timestamp");
  }

  private buildConversationHistory(
    messages: Message[],
    latestUserPrompt: string
  ): string {
    const history = messages
      .map((msg) => `User: ${msg.userPrompt}\nAssistant: ${msg.assistantReply}`)
      .join("\n");
    return `${history}\nUser: ${latestUserPrompt}`;
  }
  
  private assembleContext(conversationHistory: string): string {
    const fullInitialPrompt = `${INITIAL_PROMPT}\nNow start the dialogue, the user's initial prompt is: ${this.initialUserPrompt}`;
    const initialSetup = `# Initial setup: ${fullInitialPrompt}`;
    const separator = "\n# Current conversation progress: ";
    const footer =
      "\n# It's assistant's turn to reply and You only need to send reply for this round of conversation";


    const setupAndSeparatorTokens = this.getTokenCount(
      initialSetup + separator + footer
    );
    const remainingTokens = this.maxTokens - setupAndSeparatorTokens;

    if (remainingTokens <= 0) {
      console.warn("Initial setup exceeds max token limit");
      return initialSetup + separator + footer;
    }

    const truncatedHistory = this.truncateToMaxTokens(
      conversationHistory,
      remainingTokens
    );
    return `${initialSetup}${separator}${truncatedHistory}${footer}`;
  }

  private truncateToMaxTokens(text: string, remainingTokens: number): string {
    const tokens = this.tokenizer.encode(text);
    if (tokens.length <= remainingTokens) {
      return text;
    }
    return this.tokenizer.decode(tokens.slice(-remainingTokens));
  }

  getTokenCount(text: string): number {
    return this.tokenizer.encode(text).length;
  }
}
export const contextManager = new ContextManager();