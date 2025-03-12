import { env } from "@/src/constants/AppConfig";

interface Message {
  role: "system" | "user" | "assistant" | "function" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[]; 

}

export interface FunctionParameter {
  type: string;
  properties: Record<string, any>;
  required?: string[];
  additionalProperties: boolean;
}

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: FunctionParameter;
  strict?: boolean;
}

export interface Tool {
  type: "function";
  function: FunctionDefinition;
}

interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  tools?: Tool[];
  tool_choice?: "auto" | "none" | { type: string; function: { name: string } };
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string | null;
      tool_calls?: ToolCall[];
    };
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
   * @param tools Optional array of tools (functions) that the model can call
   * @param toolChoice Optional parameter to control tool selection behavior
   * @returns Promise with the API response
   */
  async generateChatCompletion(
    messages: Message[],
    model = "gpt-4o",
    tools?: Tool[],
    toolChoice?: "auto" | "none" | { type: string; function: { name: string } }
  ): Promise<Message> {
    try {
      const request: ChatCompletionRequest = {
        model,
        messages,
        temperature: 0.7,
      };

      // Add tools if provided
      if (tools && tools.length > 0) {
        request.tools = tools;
      }

      // Add tool_choice if provided
      if (toolChoice) {
        request.tool_choice = toolChoice;
      }

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
      const responseMessage = data.choices[0].message;

      // Convert response to Message format
      return {
        role: responseMessage.role as "assistant",
        content: responseMessage.content || "",
        ...(responseMessage.tool_calls && { tool_calls: responseMessage.tool_calls }),
      };
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return {
        role: "assistant",
        content: "Sorry, I couldn't process your request due to an error."
      };
    }
  }
}
