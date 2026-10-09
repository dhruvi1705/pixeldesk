import { useState, useCallback } from "react";
import { useWorkspaceContext } from "./useWorkspaceContext";
import {
  processCopilotQuery,
  SUGGESTED_PROMPTS,
  COPILOT_CONFIG
} from "../utils/copilotService";

const INITIAL_WELCOME_MESSAGE = {
  id: "msg_init_welcome",
  sender: "assistant",
  source: "local-engine",
  timestamp: new Date().toISOString(),
  text: `Hello! I am **PixelDesk Copilot** (${COPILOT_CONFIG.VERSION}).\n\nI operate in **Deterministic Local Workspace Query Mode**. I can instantly calculate and summarize your real Tasks, Calendar, Focus sessions, and Finance records without sending any data over the network.\n\nPick a suggested prompt below or type your question!`,
  isWelcome: true
};

export function useCopilot() {
  const workspaceContext = useWorkspaceContext();

  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const toggleContextPanel = useCallback(() => {
    setIsContextPanelOpen((prev) => !prev);
  }, []);

  const sendMessage = useCallback(
    async (userInput) => {
      const trimmed = (userInput || "").trim();
      if (!trimmed || isLoading) return;

      const userMsg = {
        id: `msg_user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        sender: "user",
        text: trimmed,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Trigger companion event for copilot interaction
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("pixeldesk_companion_event", {
            detail: { type: "WORKING", timestamp: new Date().toISOString() }
          })
        );
      }

      try {
        // Small delay (180ms) for natural UI interaction feel without artificial lag
        await new Promise((resolve) => setTimeout(resolve, 180));

        const result = await processCopilotQuery(trimmed, workspaceContext);

        const assistantMsg = {
          id: `msg_asst_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          sender: "assistant",
          source: result.source || "local-engine",
          status: result.status || "success",
          intent: result.intent,
          text: result.text,
          timestamp: new Date().toISOString()
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error("[useCopilot] Error processing query:", err);
        const errorMsg = {
          id: `msg_err_${Date.now()}`,
          sender: "assistant",
          source: "local-engine",
          status: "error",
          text: "⚠️ An error occurred while analyzing workspace data. Please try again.",
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, workspaceContext]
  );

  const clearConversation = useCallback(() => {
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        id: `msg_init_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    ]);
    setShowClearConfirm(false);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
    showClearConfirm,
    setShowClearConfirm,
    isContextPanelOpen,
    setIsContextPanelOpen,
    toggleContextPanel,
    suggestedPrompts: SUGGESTED_PROMPTS,
    workspaceContext,
    version: COPILOT_CONFIG.VERSION
  };
}
