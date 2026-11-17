import { AlertCircle, Layers, Zap } from "lucide-react";
import { DEPTH_LEVEL_OPTIONS, type DepthLevel } from "../types/anatomy";

interface SidebarProps {
  depthLevel: DepthLevel;
  onChangeDepthLevel: (level: DepthLevel) => void;
  onGenerateQuiz: () => void;
  isGeneratingQuiz: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  depthLevel,
  onChangeDepthLevel,
  onGenerateQuiz,
  isGeneratingQuiz,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/65 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Menu de Ferramentas"
        className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[88vw] flex-col border-r border-[#0088FF]/20 bg-[#091526] transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-80 lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">
          {/* Seletor de Nível de Profundidade */}
          <section aria-labelledby="depth-heading">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4 text-[#00E5FF] shrink-0" />
              <h2
                id="depth-heading"
                className="text-sm font-bold tracking-wide text-white"
              >
                Nível de Profundidade
              </h2>
            </div>

            <div
              className="space-y-2.5"
              role="radiogroup"
              aria-label="Nível de Profundidade"
            >
              {DEPTH_LEVEL_OPTIONS.map((option) => {
                const isActive = depthLevel === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => onChangeDepthLevel(option.id)}
                    className={`w-full text-left rounded-xl border px-3.5 py-3 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${
                      isActive
                        ? "border-[#00E5FF] bg-[#0088FF]/15 shadow-[0_0_18px_rgba(0,229,255,0.16)]"
                        : "border-[#0088FF]/20 bg-[#040B14]/65 hover:border-[#0088FF]/55 hover:bg-[#040B14]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isActive ? "text-[#00E5FF]" : "text-white"
                        }`}
                      >
                        {option.label}
                      </span>
                      {isActive && (
                        <span className="text-[11px] font-semibold text-[#76FF03]">
                          Ativo
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-300 leading-snug">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Gerar Quiz Rápido */}
          <section aria-labelledby="quiz-heading">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-[#76FF03] shrink-0" />
              <h2
                id="quiz-heading"
                className="text-sm font-bold tracking-wide text-white"
              >
                Teste de Conhecimento
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                onGenerateQuiz();
                onCloseMobile();
              }}
              disabled={isGeneratingQuiz}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00E640] to-[#76FF03] px-4 py-3 text-sm font-bold text-[#040B14] shadow-[0_0_22px_rgba(0,230,64,0.3)] transition-all duration-150 hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76FF03]"
            >
              <span>
                {isGeneratingQuiz ? "Gerando Quiz..." : "⚡ Gerar Quiz Rápido"}
              </span>
            </button>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Cria uma questão de múltipla escolha sobre o assunto atual ou um tema clássico de anatomia.
            </p>
          </section>
        </div>

        {/* Aviso Ético discreto no rodapé do menu */}
        <div className="border-t border-[#0088FF]/20 px-5 py-3.5 bg-[#040B14]/45">
          <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#E53935] mt-0.5" />
            <span>
              Fins estritamente educacionais. Não realiza diagnósticos ou prescrições médicas.
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
