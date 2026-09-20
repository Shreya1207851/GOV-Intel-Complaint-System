import { apiClient } from "./apiClient";

export interface AssistantMessagePayload {
  role: "user" | "assistant";
  text: string;
}

export interface AssistantChatResponse {
  reply: string;
  model: string;
  complaintCount: number;
}

export const assistantApi = {
  chat(messages: AssistantMessagePayload[]) {
    return apiClient.post("/api/assistant/chat", { messages }) as Promise<AssistantChatResponse>;
  },
};
