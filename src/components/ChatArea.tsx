import {
  AlertTriangle,
  FileText,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import {
  MASCOT_URL,
  type ChatMessage,
  type DepthLevel,
  type StudyMaterial,
} from "../types/anatomy";
import { formatFileSize, readFileAsStudyMaterial } from "../utils/files";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { QuizCard } from "./QuizCard";
import { WelcomeScreen } from "./WelcomeScreen";

interface ChatAreaProps {
  messages: ChatMessage[];
  depthLevel: DepthLevel;
  isStreaming: boolean;
  isGeneratingQuiz: boolean;
  showQuizControls: boolean;
  onSendMessage: (text: string, attachments: StudyMaterial[]) => void;
  onSelectQuizOption: (quizId: string, optionIndex: number) => void;
  onGenerateQuiz: (topicOverride?: string) => void;
}

export function ChatArea({
  messages,
  depthLevel,
  isStreaming,
  isGeneratingQuiz,
  showQuizControls,
  onSendMessage,
  onSelectQuizOption,
  onGenerateQuiz,
}: ChatAreaProps) {
  const [inputText, setInputText] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<StudyMaterial[]>(
    []
  );
  const [attachError, setAttachError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({
      behavior: isStreaming ? "auto" : "smooth",
    });
  }, [messages, isGeneratingQuiz, isStreaming]);

  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleAttachChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setAttachError(null);

    const added: StudyMaterial[] = [];
    for (const file of Array.from(files)) {
      try {
        const material = await readFileAsStudyMaterial(file);
        added.push(material);
      } catch (err) {
        setAttachError(
          err instanceof Error ? err.message : "Falha ao anexar arquivo."
        );
      }
    }
    if (added.length > 0) {
      setPendingAttachments((prev) => [...prev, ...added]);
    }
    e.target.value = "";
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (isStreaming) return;
    const trimmed = inputText.trim();
    if (!trimmed && pendingAttachments.length === 0) return;

    onSendMessage(trimmed, pendingAttachments);
    setInputText("");
    setPendingAttachments([]);
    setAttachError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      {/* Área rolável de mensagens ou tela inicial */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.length === 0 && !isGeneratingQuiz ? (
          <WelcomeScreen
            depthLevel={depthLevel}
            onSelectPrompt={(prompt) => onSendMessage(prompt, [])}
          />
        ) : (
          <div className="mx-auto w-full max-w-4xl space-y-6">
            {messages.map((msg) => {
              const isUser = msg.role === "user";

              if (isUser) {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[88%] sm:max-w-[78%] rounded-2xl border border-[#0088FF]/45 bg-[#091526] px-4 py-3.5 text-white shadow-[0_4px_20px_rgba(0,136,255,0.1)]">
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mb-2.5 flex flex-wrap gap-2">
                          {msg.attachments.map((att) =>
                            att.previewUrl ? (
                              <div
                                key={att.id}
                                className="overflow-hidden rounded-lg border border-[#00E5FF]/40 bg-[#040B14]"
                              >
                                <img
                                  src={att.previewUrl}
                                  alt={att.name}
                                  referrerPolicy="no-referrer"
                                  className="max-h-48 max-w-[240px] object-contain"
                                />
                              </div>
                            ) : (
                              <div
                                key={att.id}
                                className="inline-flex items-center gap-2 rounded-lg border border-[#00E5FF]/35 bg-[#040B14] px-3 py-1.5 text-xs text-[#00E5FF]"
                              >
                                <FileText className="h-3.5 w-3.5 shrink-0" />
                                <span className="max-w-[180px] truncate">
                                  {att.name}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                      {msg.content && (
                        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-white">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-0.5 h-9 w-9 shrink-0 rounded-full p-[1.5px] bg-gradient-to-br from-[#0088FF] to-[#00E640]">
                    <div className="h-full w-full overflow-hidden rounded-full bg-[#091526] flex items-center justify-center">
                      {!avatarError ? (
                        <img
                          src={MASCOT_URL}
                          alt="Anatom-IA"
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarError(true)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-[#00E640]">
                          IA
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    {msg.quiz ? (
                      <QuizCard
                        quiz={msg.quiz}
                        onSelectOption={onSelectQuizOption}
                        onGenerateAnother={(topic) => onGenerateQuiz(topic)}
                        isGeneratingQuiz={isGeneratingQuiz}
                        showQuizControls={showQuizControls}
                      />
                    ) : msg.error ? (
                      <div
                        role="alert"
                        className="flex items-start gap-2.5 rounded-2xl border border-[#E53935]/60 bg-[#E53935]/10 px-4 py-3.5 text-sm text-red-100"
                      >
                        <AlertTriangle className="h-5 w-5 shrink-0 text-[#E53935] mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#E53935]">
                            Não foi possível completar a resposta
                          </p>
                          <p className="mt-1 text-slate-200">{msg.error}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-[#0088FF]/25 bg-[#091526]/75 px-4 py-3.5 sm:px-5 sm:py-4">
                        {msg.content ? (
                          <MarkdownRenderer content={msg.content} />
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-[#00E5FF]">
                            <span>Analisando estruturas anatômicas...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isGeneratingQuiz && (
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-0.5 h-9 w-9 shrink-0 rounded-full p-[1.5px] bg-gradient-to-br from-[#0088FF] to-[#00E640]">
                  <div className="h-full w-full overflow-hidden rounded-full bg-[#091526] flex items-center justify-center">
                    <span className="text-xs font-bold text-[#76FF03]">⚡</span>
                  </div>
                </div>
                <div className="flex-1 rounded-2xl border border-[#00E640]/35 bg-[#091526]/80 px-5 py-4 text-sm text-[#76FF03]">
                  Elaborando pergunta de Quiz Rápido...
                </div>
              </div>
            )}

            <div ref={bottomAnchorRef} />
          </div>
        )}
      </div>

      {/* Barra de digitação inferior */}
      <div className="border-t border-[#0088FF]/20 bg-[#040B14]/95 px-4 py-3.5 sm:px-6 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
          {attachError && (
            <div
              role="alert"
              className="mb-2 flex items-center gap-2 rounded-lg border border-[#E53935]/50 bg-[#E53935]/10 px-3 py-1.5 text-xs text-red-200"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#E53935]" />
              <span>{attachError}</span>
            </div>
          )}

          {pendingAttachments.length > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-2">
              {pendingAttachments.map((att) => (
                <div
                  key={att.id}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#00E5FF]/40 bg-[#091526] px-2.5 py-1.5 text-xs text-white"
                >
                  {att.previewUrl ? (
                    <img
                      src={att.previewUrl}
                      alt={att.name}
                      referrerPolicy="no-referrer"
                      className="h-6 w-6 rounded object-cover"
                    />
                  ) : (
                    <FileText className="h-4 w-4 text-[#00E5FF]" />
                  )}
                  <span className="max-w-[150px] truncate">{att.name}</span>
                  <span className="font-mono tabular-nums text-[11px] text-slate-400">
                    {formatFileSize(att.size)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remover anexo ${att.name}`}
                    onClick={() =>
                      setPendingAttachments((prev) =>
                        prev.filter((item) => item.id !== att.id)
                      )
                    }
                    className="rounded p-0.5 text-slate-400 hover:bg-[#E53935]/20 hover:text-[#E53935] cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2.5 rounded-2xl border border-[#0088FF]/45 bg-[#091526] p-2 shadow-[0_0_24px_rgba(0,136,255,0.12)] focus-within:border-[#00E5FF] transition-colors">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Anexar imagem ou PDF"
              title="Anexar imagem de diagrama ou PDF"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#0088FF]/25 bg-[#040B14]/70 text-[#00E5FF] hover:border-[#00E5FF] hover:bg-[#0088FF]/15 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,image/*"
              onChange={handleAttachChange}
              className="hidden"
            />

            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre ossos, músculos, órgãos ou anexe uma imagem/PDF..."
              aria-label="Digite sua pergunta sobre anatomia ou fisiologia"
              className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent py-2.5 px-1.5 text-[15px] text-white placeholder:text-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={
                isStreaming ||
                (!inputText.trim() && pendingAttachments.length === 0)
              }
              aria-label="Enviar mensagem"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00E640] to-[#76FF03] px-4 font-bold text-[#040B14] shadow-[0_0_18px_rgba(0,230,64,0.28)] transition-all duration-150 hover:brightness-110 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76FF03]"
            >
              <Send className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline text-sm">Enviar</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
