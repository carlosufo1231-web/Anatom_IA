import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ChatArea } from "./components/ChatArea";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import type {
  ChatMessage,
  DepthLevel,
  QuizData,
  StudyMaterial,
} from "./types/anatomy";

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [depthLevel, setDepthLevel] = useState<DepthLevel>("estudante");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleNewChat = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setMessages([]);
    setIsStreaming(false);
    setIsGeneratingQuiz(false);
    setIsSidebarOpenMobile(false);
  }, []);

  const handleSendMessage = useCallback(
    async (text: string, attachments: StudyMaterial[]) => {
      const userMessage: ChatMessage = {
        id: createId("user"),
        role: "user",
        content: text,
        attachments: attachments.length > 0 ? attachments : undefined,
        timestamp: Date.now(),
      };

      const assistantId = createId("assistant");
      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      };

      const conversationHistory = [...messages, userMessage]
        .filter((m) => !m.quiz && !m.error)
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.content,
          attachments: m.attachments?.map((a) => ({
            name: a.name,
            mimeType: a.mimeType,
            dataBase64: a.dataBase64,
          })),
        }));

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: conversationHistory,
            depthLevel,
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error(
            `Falha de comunicação com o servidor (${response.status}).`
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() ?? "";

          for (const rawEvent of events) {
            const lines = rawEvent.split(/\r?\n/);
            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const payloadStr = line.slice(5).trim();
              if (!payloadStr) continue;

              try {
                const parsed = JSON.parse(payloadStr) as {
                  text?: string;
                  done?: boolean;
                  error?: string;
                };

                if (parsed.error) {
                  flushSync(() => {
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantId
                          ? { ...m, error: parsed.error, isStreaming: false }
                          : m
                      )
                    );
                  });
                  return;
                }

                if (parsed.text) {
                  accumulatedText += parsed.text;
                  flushSync(() => {
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantId
                          ? { ...m, content: accumulatedText }
                          : m
                      )
                    );
                  });
                }

                if (parsed.done) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId ? { ...m, isStreaming: false } : m
                    )
                  );
                }
              } catch {
                // Ignore incomplete SSE JSON fragment
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : "Erro inesperado ao consultar a Anatom-IA.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, error: message, isStreaming: false }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [depthLevel, messages]
  );

  const handleGenerateQuiz = useCallback(
    async (topicOverride?: string) => {
      if (isGeneratingQuiz) return;
      setIsGeneratingQuiz(true);

      const recentContext = messages
        .filter((m) => !m.quiz && !m.error && m.content)
        .slice(-4)
        .map(
          (m) => `${m.role === "user" ? "Estudante" : "Anatom-IA"}: ${m.content}`
        )
        .join("\n\n");

      try {
        const response = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: topicOverride ?? "",
            recentContext,
            depthLevel,
          }),
        });

        const data = (await response.json()) as Partial<QuizData> & {
          error?: string;
        };

        if (!response.ok || data.error) {
          throw new Error(
            data.error || "Não foi possível gerar o quiz rápido."
          );
        }

        const quizMessage: ChatMessage = {
          id: createId("quiz-msg"),
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          quiz: {
            id: createId("quiz"),
            topic: data.topic || "Anatomia Humana",
            question: data.question || "",
            options: Array.isArray(data.options) ? data.options : [],
            correctIndex:
              typeof data.correctIndex === "number" ? data.correctIndex : 0,
            explanation: data.explanation || "",
            mnemonic: data.mnemonic || "",
            selectedOption: null,
          },
        };

        setMessages((prev) => [...prev, quizMessage]);
      } catch (err) {
        const errorMsg: ChatMessage = {
          id: createId("quiz-err"),
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          error:
            err instanceof Error
              ? err.message
              : "Erro ao gerar o Quiz Rápido.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsGeneratingQuiz(false);
      }
    },
    [depthLevel, isGeneratingQuiz, messages]
  );

  const handleSelectQuizOption = useCallback(
    (quizId: string, optionIndex: number) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.quiz && m.quiz.id === quizId
            ? {
                ...m,
                quiz: {
                  ...m.quiz,
                  selectedOption: optionIndex,
                },
              }
            : m
        )
      );
    },
    []
  );

  return (
    <div className="bg-hex-grid flex h-screen w-full flex-col overflow-hidden text-white">
      <Header
        onNewChat={handleNewChat}
        isSidebarOpen={isSidebarOpenMobile}
        onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          depthLevel={depthLevel}
          onChangeDepthLevel={setDepthLevel}
          onGenerateQuiz={() => handleGenerateQuiz()}
          isGeneratingQuiz={isGeneratingQuiz}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        <ChatArea
          messages={messages}
          depthLevel={depthLevel}
          isStreaming={isStreaming}
          isGeneratingQuiz={isGeneratingQuiz}
          onSendMessage={handleSendMessage}
          onSelectQuizOption={handleSelectQuizOption}
          onGenerateQuiz={handleGenerateQuiz}
        />
      </div>
    </div>
  );
}
