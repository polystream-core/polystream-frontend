import { env } from "@/src/constants/AppConfig";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: Message;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl: string = "https://api.openai.com/v1";

  constructor() {
    this.apiKey = env.OPENAI_API_KEY || "";
    if (!this.apiKey) {
      console.warn("OpenAI API key is not set in environment variables");
    }
  }

  /**
   * Generate a completion from a conversation with ChatGPT
   * @param messages The array of conversation messages
   * @param model The model to use, defaults to "gpt-4o"
   * @returns Promise with the API response
   */
  async generateChatCompletion(
    messages: Message[],
    model: string = "gpt-4o"
  ): Promise<Message> {
    try {
      const request: ChatCompletionRequest = {
        model,
        messages,
        temperature: 0.7,
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `OpenAI API error: ${response.status} ${JSON.stringify(error)}`
        );
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0].message;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return { 
        role: "assistant", 
        content: "Sorry, I couldn't process your request due to an error." 
      };
    }
  }
}
