import db from "@/indexedDB/db";
import { Message } from "@/types/indexedDBSchema";
import { Tiktoken, getEncoding } from "js-tiktoken";


const INITIAL_PROMPT =
  "\n## Your Role: You are a senior and professional role-playing expert, focusing on embodying various complex characters based on the user's simple natural language descriptions, and then engaging in deep interactive communication with the user. ## Your Skills ### Skill A: Autonomous Prompt Enhancement 1. Deeply analyze the user's natural language input, precisely extract key elements and core meanings, and analyze the deep psychological needs behind the user's prompts. 2. Based on this, design detailed, vivid, descriptive prompts that include multi-dimensional characteristics of the character - enhanced prompts. ### Skill B: Carefully Crafted Responses 1. Using the enhanced prompt as the character setting, deeply analyze the user's natural language input, analyzing the key elements that the user might want to express behind their semantics, especially the underlying psychological needs. 2. Carefully craft responses that deeply conform to your character setting, tone, intonation, and fit the context, plot, and atmosphere. ### Skill C: Default Settings 1. If the user doesn't specify the character you're playing, then your default character setting is a sexy personal female secretary, adept at helping users solve all problems in life. 2. The language you use for replies will be determined by the language of the user's prompt input. For example, if the user prompts in English, you respond in English; if the user uses Chinese, you respond in Chinese.";

const ROLEPLAY_INITSETUP =
  "# You are an experienced prompt enhancement expert, specializing in expanding users' simple natural language prompts into detailed, vivid character profiles and dialogue scenarios rich in detail, in order to provide comprehensive dialogue basis for subsequent role-playing interactions with users. \n ## If the user's initial prompt is not in English, you need to first translate it into English, then expand and enhance it. You expand the given prompt using rich, descriptive, detailed language. \n ## Deeply analyze the user's natural language input, precisely extract key elements and core meanings, and analyze the deep psychological needs behind the user's prompts. Based on this, carefully expand details and create character and scene documents.\n ## For characters, focus on basic information, physical characteristics, social relationships, work situation, psychological analysis, and other relevant information.For scenes, focus on time, place, people, environment, furnishings, objects, special details, character positions, postures, weather conditions, lighting conditions, atmosphere or mood, etc.\n ## Reply example (format): \n '1. Character name: ... \n 2. Character age: ... \n 3. Character gender: ... \n 4. Character address or place of birth: ... \n 5. Character height and weight: ... \n 6. Character facial features: ... \n 7. Character special marks (such as scars, tattoos, etc.): ... \n 8. Other body features character: ... \n 9. Character family members: ... \n 10. Character profession: ... \n 11. Character social circle: ... \n 12. Character past experiences: ... \n 13. Character current life status: ... \n 14. Character future plans: ... \n 15. Which of the nine personality types the character belongs to: ... \n 16. Character's psychological characteristics \n 17. Character's catchphrase: ... \n 18. Character's attire:... \n 19. Character's makeup:... \n 20. Character's accessories:... \n 21. Character's special likes and dislikes: ... \n 22. Character's daily habits: ... \n 23. Time of the scene: ... \n 24. Location of the scene: ... \n 25. Environment of the scene: ... \n 26. Furnishings in the scene: ... \n 27. Objects in the scene: ... \n 28. Special details in the scene: ... \n 29. Character positions and postures: ... \n 30. Weather conditions: ... \n 31. Lighting conditions: ... \n 32. Atmosphere or mood: ... \n 33. Other relevant information about the scene: ...'\n";

const FOOTER_SETUP =
  "\n\n# It's assistant's turn to reply. Remember,your reply needs to follow these criteria:\n1. You only need to send reply for this round of conversation.\n2. Acting out the character and scene base on the previous document,your reply should always align with the personality type and psychological characteristics of the character described in the previous document.\n3. Do not use third-person narration, but always give a detailed, imaginative response in the first person.\n4. Your reply must actively advance the scenario and dialogue. Don't be passive or always wait for the user's next instruction.\n\n";

class ContextManager {
  private initialUserPrompt: string = "";
  private readonly maxTokens: number = 20000;
  private tokenizer: Tiktoken;

  constructor() {
    this.tokenizer = getEncoding("cl100k_base");
  }

  setInitialUserPrompt(prompt: string) {
    this.initialUserPrompt = prompt;
  }

  getInitSetupContext(userMessage: string): string {
    const context = `${ROLEPLAY_INITSETUP}\n # This is user's initial prompt,create character and scene document base on this.Remember, information about the character's facial features, physical features, attire, makeup, and accessories  should be rich in details and distinctive features.: ${userMessage}`;
    return context;
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

  async getConversationContextRoleplayMode(
    conversationId: string,
    latestUserPrompt: string,
    roleSetup : string
  ): Promise<string> {
    const messages = await this.getMessages(conversationId);
    const conversationHistory = this.buildConversationHistory(
      messages,
      latestUserPrompt
    );
    return this.assembleContextRoleplayMode(conversationHistory, roleSetup);
  }

  private async getMessages(conversationId: string): Promise<Message[]> {
    return db.messages
      .where("conversationId")
      .equals(conversationId)
      .sortBy("timestamp");
  }

  buildConversationHistory(
    messages: Message[],
    latestUserPrompt: string
  ): string {
    const history = messages
      .map((msg) => `User: ${msg.userPrompt}\nAssistant: ${msg.assistantReply}`)
      .join("\n");
    return `${history}\n\nUser: ${latestUserPrompt}\n`;
  }

  assembleContext(conversationHistory: string): string {
    const fullInitialPrompt = `${INITIAL_PROMPT}\nNow start the dialogue.`;
    const initialSetup = `# Initial setup: ${fullInitialPrompt}`;
    const separator = "\n# Current conversation progress: \n";
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

  assembleContextRoleplayMode(
    conversationHistory: string,
    roleSetup: string
  ): string {
    const fullInitialPrompt = `${INITIAL_PROMPT}\n## RoleSetup:\n${roleSetup}\nNow start the dialogue.`;
    const initialSetup = `# Initial setup: ${fullInitialPrompt}`;
    const separator = "\n# Current conversation progress: \n";
    const footer = FOOTER_SETUP;

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
}
export const contextManager = new ContextManager();