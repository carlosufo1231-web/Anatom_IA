import { Menu, MessageSquarePlus, X } from "lucide-react";
import { useState } from "react";
import { LOGO_URL } from "../types/anatomy";

interface HeaderProps {
  onNewChat: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({
  onNewChat,
  isSidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[#0088FF]/25 bg-[#040B14]/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={
              isSidebarOpen ? "Fechar menu de ferramentas" : "Abrir menu de ferramentas"
            }
            className="inline-flex lg:hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#0088FF]/40 bg-[#091526] text-[#00E5FF] hover:border-[#00E5FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="relative h-12 w-12 shrink-0 rounded-full p-[2px] bg-gradient-to-br from-[#0088FF] via-[#00E5FF] to-[#00E640] shadow-[0_0_16px_rgba(0,229,255,0.3)]">
            <div className="h-full w-full overflow-hidden rounded-full bg-[#040B14] flex items-center justify-center">
              {!logoError ? (
                <img
                  src={LOGO_URL}
                  alt="Logo Anatom-IA"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  viewBox="0 0 40 40"
                  className="h-7 w-7 text-[#00E5FF]"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="20"
                    cy="20"
                    r="15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 21h5l3-7 4 13 3-9 2 3h7"
                    stroke="#00E640"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none whitespace-nowrap">
                <span className="text-white">Anatom-</span>
                <span className="text-[#00E640]">IA</span>
              </h1>
              <svg
                viewBox="0 0 120 18"
                className="hidden sm:block h-4 w-28 shrink-0"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M0 10 L26 10 L32 10 L36 4 L41 15 L46 2 L51 16 L55 10 L64 10 L70 10 L74 6 L78 13 L82 10 L120 10"
                  stroke="#00E640"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ecg-line-animated"
                />
              </svg>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 truncate">
              Seu assistente inteligente de Anatomia Humana
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-[#00E5FF]/65 bg-[#091526]/90 px-4 py-2 text-sm font-semibold text-[#00E5FF] shadow-[0_0_16px_rgba(0,229,255,0.18)] transition-all duration-150 hover:border-[#00E5FF] hover:bg-[#0088FF]/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] whitespace-nowrap cursor-pointer"
        >
          <MessageSquarePlus className="h-4 w-4 shrink-0" />
          <span>Novo Chat</span>
        </button>
      </div>
    </header>
  );
}
