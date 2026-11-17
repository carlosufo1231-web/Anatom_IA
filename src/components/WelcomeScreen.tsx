import { useState } from "react";
import { DEPTH_LEVEL_OPTIONS, MASCOT_URL, type DepthLevel } from "../types/anatomy";

interface WelcomeScreenProps {
  depthLevel: DepthLevel;
  onSelectPrompt: (prompt: string) => void;
}

const STARTER_CARDS = [
  {
    id: "cardio",
    prompt: "🫀 Como funciona o ciclo cardíaco?",
    subtitle: "Sístole, diástole, valvas e fluxo sanguíneo pelas câmaras",
  },
  {
    id: "bones",
    prompt: "🦴 Quais são os ossos do esqueleto apendicular?",
    subtitle: "Cíngulos escapular e pélvico, membros superiores e inferiores",
  },
  {
    id: "nervous",
    prompt: "🧠 Explique o Sistema Nervoso Central vs. Periférico",
    subtitle: "Organização estrutural, encéfalo, medula espinal e nervos",
  },
  {
    id: "muscle",
    prompt: "💪 Estrutura de um músculo (Origem, Inserção e Função)",
    subtitle: "Sarcômeros, fibras musculares e biomecânica da contração",
  },
];

export function WelcomeScreen({
  depthLevel,
  onSelectPrompt,
}: WelcomeScreenProps) {
  const [mascotError, setMascotError] = useState(false);
  const currentLevel =
    DEPTH_LEVEL_OPTIONS.find((item) => item.id === depthLevel) ??
    DEPTH_LEVEL_OPTIONS[1];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-8 sm:py-12">
      {/* Avatar do Mascote Robô */}
      <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full p-[3px] bg-gradient-to-br from-[#0088FF] via-[#00E5FF] to-[#00E640] shadow-[0_0_32px_rgba(0,229,255,0.28)]">
        <div className="h-full w-full overflow-hidden rounded-full bg-[#091526] flex items-center justify-center">
          {!mascotError ? (
            <img
              src={MASCOT_URL}
              alt="Mascote Tutor Anatom-IA"
              referrerPolicy="no-referrer"
              onError={() => setMascotError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              viewBox="0 0 64 64"
              className="h-16 w-16 text-[#00E5FF]"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="14"
                y="16"
                width="36"
                height="28"
                rx="10"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <circle cx="25" cy="29" r="3.5" fill="#00E5FF" />
              <circle cx="39" cy="29" r="3.5" fill="#00E5FF" />
              <path
                d="M24 38h16"
                stroke="#00E640"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="mt-5 text-center max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white [text-wrap:balance]">
          Olá! Eu sou a{" "}
          <span className="text-white">Anatom-</span>
          <span className="text-[#00E640]">IA</span>
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-300 leading-relaxed">
          Sua tutora inteligente de anatomia e fisiologia humana. Escolha um tema abaixo ou envie sua dúvida, diagrama ou apostila em PDF.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Modo atual:{" "}
          <span className="font-semibold text-[#00E5FF]">
            {currentLevel.label}
          </span>{" "}
          <span aria-hidden="true">·</span>{" "}
          <span>{currentLevel.description}</span>
        </p>
      </div>

      {/* 4 Cartões Clicáveis com Borda Degradê Azul/Verde */}
      <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {STARTER_CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectPrompt(card.prompt)}
            className="group relative rounded-2xl p-[1.5px] bg-gradient-to-br from-[#0088FF]/80 via-[#00E5FF]/70 to-[#00E640]/80 text-left transition-all duration-150 hover:from-[#00E5FF] hover:to-[#76FF03] hover:shadow-[0_0_24px_rgba(0,229,255,0.22)] active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
          >
            <div className="h-full rounded-[14.5px] bg-[#091526]/95 px-5 py-4 transition-colors group-hover:bg-[#091526]">
              <p className="text-sm sm:text-[15px] font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                {card.prompt}
              </p>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                {card.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
