import { useState, useCallback, useEffect } from 'react';
import { OpenAIService } from '../services/openai';

export interface Message {
    role: "system" | "user" | "assistant";
    content: string;
    id?: string;
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const openAIService = new OpenAIService();

    // Initialize with system message
    useEffect(() => {
        const systemMessage: Message = {
            role: "system",
            content: "You are a helpful financial assistant for the Polystream application. You help users understand cryptocurrency investments, yield strategies, and financial concepts. Always provide clear and concise information, and prioritize user security. Don't encourage risky investments or ask for sensitive information.",
            id: "system-init"
        };

        setMessages([systemMessage]);
    }, []);

    /**
     * Send a message to the OpenAI API and get a response
     * @param userMessage The message to send
     */
    const sendMessage = useCallback(async (userMessage: string) => {
        if (!userMessage.trim()) return;

        // Add user message to the chat
        const userMsg: Message = {
            role: "user",
            content: userMessage,
            id: Date.now().toString()
        };

        setMessages(prevMessages => [...prevMessages, userMsg]);
        setIsLoading(true);
        setError(null);

        try {
            // Get all messages for context
            const messageHistory = [...messages, userMsg];

            // Send to API
            const assistantMessage = await openAIService.generateChatCompletion(messageHistory);

            // Add response to chat with an ID
            const assistantMessageWithId: Message = {
                ...assistantMessage,
                id: `assistant-${Date.now()}`
            };

            setMessages(prevMessages => [...prevMessages, assistantMessageWithId]);
        } catch (err) {
            console.error("Error in chat:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsLoading(false);
        }
    }, [messages, openAIService]);

    /**
     * Clear the conversation history
     */
    const clearChat = useCallback(() => {
        // Reset to just the system message
        const systemMessage: Message = {
            role: "system",
            content: "You are a helpful financial assistant for the Polystream application. You help users understand cryptocurrency investments, yield strategies, and financial concepts. Always provide clear and concise information, and prioritize user security. Don't encourage risky investments or ask for sensitive information.",
            id: "system-init"
        };

        setMessages([systemMessage]);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat
    };
}
