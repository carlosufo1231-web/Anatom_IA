export type DepthLevel = "iniciante" | "estudante" | "revisao";

export interface StudyMaterial {
  id: string;
  name: string;
  mimeType: string;
  dataBase64: string;
  size: number;
  previewUrl?: string;
}

export interface QuizData {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  mnemonic: string;
  selectedOption?: number | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: StudyMaterial[];
  quiz?: QuizData;
  timestamp: number;
  isStreaming?: boolean;
  error?: string;
}

export const DEPTH_LEVEL_OPTIONS: Array<{
  id: DepthLevel;
  label: string;
  description: string;
}> = [
  {
    id: "iniciante",
    label: "Iniciante / Curioso",
    description: "Analogias claras e termos traduzidos",
  },
  {
    id: "estudante",
    label: "Estudante de Saúde",
    description: "Terminologia oficial, vasos e nervos",
  },
  {
    id: "revisao",
    label: "Modo Revisão Rápida",
    description: "Tópicos diretos, esquemas e tabelas",
  },
];

export const LOGO_URL = "/src/assets/images/anatomia_logo_1794886277144.jpg";
export const MASCOT_URL = "/src/assets/images/anatomia_mascot_1794886277151.jpg";
