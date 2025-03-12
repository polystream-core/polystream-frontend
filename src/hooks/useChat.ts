import { useState, useCallback, useEffect } from 'react';
import { OpenAIService, Tool } from '../services/openai';
import { useTransaction } from './useTransaction';

export interface Message {
    role: "system" | "user" | "assistant" | "function" | "tool";
    content: string;
    id?: string;
    name?: string;
    tool_call_id?: string;
    tool_calls?: any[];
    isConfirmation?: boolean;
    confirmationData?: {
        toolCallId: string;
        riskLevel: RiskLevel;
        amount?: number;
    };
    
}

type RiskLevel = 'low' | 'medium' | 'high';

interface PendingTransaction {
    toolCallId: string;
    riskLevel: RiskLevel;
    amount?: number;
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { transferWalletToVault } = useTransaction();
    const openAIService = new OpenAIService();

    // Add these new state variables for the confirmation flow
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [pendingTransaction, setPendingTransaction] = useState<PendingTransaction | null>(null);

    // Initialize with system message
    useEffect(() => {
        const systemMessage: Message = {
            role: "system",
            content: "You are a helpful financial assistant for the Polystream application. You help users understand cryptocurrency investments, yield strategies, and financial concepts. Always provide clear and concise information, and prioritize user security. Don't encourage risky investments or ask for sensitive information. When a user wants to deposit to their vault, use the transferWalletToVault function.",
            id: "system-init"
        };

        setMessages([systemMessage]);
    }, []);

    // Define the tools that OpenAI can use
    const tools: Tool[] = [
        {
            type: "function",
            function: {
                name: "transferWalletToVault",
                description: "Transfer funds from wallet to Polystream vault with specified risk level and amount",
                parameters: {
                    type: "object",
                    properties: {
                        riskLevel: {
                            type: "string",
                            enum: ["low", "medium", "high"],
                            description: "Risk level for the investment strategy in the vault"
                        },
                        amount: {
                            type: "number",
                            description: "Amount to transfer to vault in USD"
                        }
                    },
                    required: ["riskLevel", "amount"],
                    additionalProperties: false
                },
                strict: true
            }
        }
    ];

    // Handle function calls from the assistant - this now shows the confirmation card instead of executing directly
    const handleToolCalls = useCallback(async (toolCalls: any[]) => {
        const toolCallResponses: Message[] = [];

        for (const toolCall of toolCalls) {
            if (toolCall.type === 'function' && toolCall.function.name === 'transferWalletToVault') {
                const args = JSON.parse(toolCall.function.arguments);
                const riskLevel = args.riskLevel as RiskLevel;
                const amount = args.amount;

                // Keep track of the pending transaction
                setPendingTransaction({
                    toolCallId: toolCall.id,
                    riskLevel,
                    amount
                });
                setShowConfirmation(true);

                toolCallResponses.push({
                    role: "assistant",
                    content: "",
                    id: `assistant-confirm-action-${Date.now()}`,
                    isConfirmation: true,
                    confirmationData: {
                        toolCallId: toolCall.id,
                        riskLevel,
                        amount
                    }
                });
            }
        }

        return toolCallResponses;
    }, []);

    // Handle confirmation from the user
    const handleConfirmTransaction = useCallback(async () => {
        if (!pendingTransaction) return;

        const { toolCallId, riskLevel, amount } = pendingTransaction;

        try {
            // Execute the transaction
            transferWalletToVault(riskLevel, amount);

            const successResponse: Message = {
                role: "assistant",
                name: "transferWalletToVault",
                content: `Successfully transferred to vault with ${riskLevel} risk level${amount ? ` for $${amount}` : ''}.`,
                id: `tool-${Date.now()}-${toolCallId}`
            };

            setMessages(prevMessages => {
                return [...prevMessages, successResponse];
            });
        } catch (err) {
            // Similar approach for error handling
            const errorResponse: Message = {
                role: "tool",
                tool_call_id: toolCallId,
                name: "transferWalletToVault",
                content: `Error: ${err instanceof Error ? err.message : "Unknown error occurred"}`,
                id: `tool-${Date.now()}-${toolCallId}`
            };

            setMessages(prevMessages => {
                const messagesForAPI = prevMessages.filter(msg =>
                    !msg.isConfirmation &&
                    !msg.id?.includes('confirm-message')
                );

                const updatedMessages = [...messagesForAPI, errorResponse];

                openAIService.generateChatCompletion(updatedMessages)
                    .then(finalAssistantResponse => {
                        const finalAssistantMessageWithId: Message = {
                            ...finalAssistantResponse,
                            id: `assistant-error-${Date.now()}`
                        };

                        setMessages(current => {
                            const withoutPreviousErrorResponse = current.filter(
                                msg => !msg.id?.includes('assistant-error-')
                            );
                            return [...withoutPreviousErrorResponse, finalAssistantMessageWithId];
                        });
                    })
                    .catch(error => {
                        console.error("Error getting final response:", error);
                    });

                return [...prevMessages, errorResponse];
            });
        } finally {
            // Clean up
            setShowConfirmation(false);
            setPendingTransaction(null);
        }
    }, [pendingTransaction, transferWalletToVault, openAIService]);

    // Handle cancellation from the user
    const handleCancelTransaction = useCallback(() => {
        if (!pendingTransaction) return;
        const { toolCallId } = pendingTransaction;

        // Add cancellation message as a tool response
        const cancellationResponse: Message = {
            role: "tool",
            tool_call_id: toolCallId,
            name: "transferWalletToVault",
            content: "Transaction cancelled by user.",
            id: `tool-${Date.now()}-${toolCallId}`
        };

        setMessages(prevMessages => {
            const messagesForAPI = prevMessages.filter(msg =>
                !msg.isConfirmation &&
                !msg.id?.includes('confirm-message')
            );

            const updatedMessages = [...messagesForAPI, cancellationResponse];

            openAIService.generateChatCompletion(updatedMessages)
                .then(finalAssistantResponse => {
                    const finalAssistantMessageWithId: Message = {
                        ...finalAssistantResponse,
                        id: `assistant-cancel-${Date.now()}`
                    };

                    setMessages(current => {
                        const withoutPreviousCancelResponse = current.filter(
                            msg => !msg.id?.includes('assistant-cancel-')
                        );
                        return [...withoutPreviousCancelResponse, finalAssistantMessageWithId];
                    });
                })
                .catch(error => {
                    console.error("Error getting final response:", error);
                });

            return [...prevMessages, cancellationResponse];
        });

        // Clean up
        setShowConfirmation(false);
        setPendingTransaction(null);
    }, [pendingTransaction, openAIService]);

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

            // Send to API with tools
            const assistantResponse = await openAIService.generateChatCompletion(
                messageHistory,
                "gpt-4o",
                tools
            );

            // Process tool calls if any
            if (assistantResponse.tool_calls && assistantResponse.tool_calls.length > 0) {

                // Handle tool calls and get responses
                const toolCallResponses = await handleToolCalls(assistantResponse.tool_calls);

                if (toolCallResponses.length > 0) {
                    // Add tool responses to messages
                    setMessages(prevMessages => [...prevMessages, ...toolCallResponses]);
                }
            } else {
                // Add regular response
                const assistantMessageWithId: Message = {
                    ...assistantResponse,
                    id: `assistant-${Date.now()}`
                };

                setMessages(prevMessages => [...prevMessages, assistantMessageWithId]);
            }
        } catch (err) {
            console.error("Error in chat:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsLoading(false);
        }
    }, [messages, openAIService, tools, handleToolCalls]);

    /**
     * Clear the conversation history
     */
    const clearChat = useCallback(() => {
        // Reset to just the system message
        const systemMessage: Message = {
            role: "system",
            content: "You are a helpful financial assistant for the Polystream application. You help users understand cryptocurrency investments, yield strategies, and financial concepts. Always provide clear and concise information, and prioritize user security. Don't encourage risky investments or ask for sensitive information. When a user wants to deposit to their vault, use the transferWalletToVault function.",
            id: "system-init"
        };

        setMessages([systemMessage]);
        setError(null);

        // Also clean up any pending transactions
        if (showConfirmation) {
            setShowConfirmation(false);
            setPendingTransaction(null);
        }
    }, [showConfirmation]);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat,
        showConfirmation,
        pendingTransaction,
        handleConfirmTransaction,
        handleCancelTransaction
    };
}
