import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KNOWLEDGE_FILE = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "knowledge",
  "limpo",
  "anatomialivro.txt"
);
const MAX_CHUNK_CHARS = 1400;
const CHUNK_OVERLAP_CHARS = 180;
const STOP_WORDS = new Set(
  "a à ao aos aquela aquelas aquele aqueles aquilo as até com como da das de dela delas dele deles depois do dos e ela elas ele eles em entre era essa essas esse esses esta estas este estes eu foi isso isto já lhe lhes mais mas me mesmo meu meus minha minhas muito na nas nem no nos nossa nossas nosso nossos num numa o os ou para pela pelas pelo pelos por qual quando que quem se sem seu seus sua suas também te tem um uma umas uns você vocês".split(
    " "
  )
);

export interface KnowledgeExcerpt {
  section: string;
  text: string;
}

interface IndexedChunk extends KnowledgeExcerpt {
  normalizedText: string;
  termFrequencies: Map<string, number>;
  length: number;
}

let indexPromise: Promise<IndexedChunk[]> | null = null;

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(/\s+/u)
    .filter((term) => term.length > 2 && !STOP_WORDS.has(term));
}

function splitIntoChunks(text: string): string[] {
  const normalized = text.replace(/\s+/gu, " ").trim();
  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    let end = Math.min(start + MAX_CHUNK_CHARS, normalized.length);
    if (end < normalized.length) {
      const sentenceBreak = normalized.lastIndexOf(". ", end);
      const wordBreak = normalized.lastIndexOf(" ", end);
      const breakAt =
        sentenceBreak > start + MAX_CHUNK_CHARS * 0.65
          ? sentenceBreak + 1
          : wordBreak;
      if (breakAt > start) end = breakAt;
    }

    const chunk = normalized.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end >= normalized.length) break;

    const overlapStart = Math.max(start + 1, end - CHUNK_OVERLAP_CHARS);
    const nextWord = normalized.indexOf(" ", overlapStart);
    start = nextWord >= 0 && nextWord < end ? nextWord + 1 : overlapStart;
  }

  return chunks;
}

async function buildIndex(): Promise<IndexedChunk[]> {
  let source: string;
  try {
    source = await readFile(KNOWLEDGE_FILE, "utf8");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Não foi possível ler a base local em ${KNOWLEDGE_FILE}: ${detail}`
    );
  }

  const sections: Array<{ section: string; text: string }> = [];
  let sectionName = "Livro de anatomia";
  let sectionParagraphs: string[] = [];
  let paragraphLines: string[] = [];
  let awaitingChapterTitle = false;

  const flushParagraph = () => {
    const paragraph = paragraphLines.join(" ").replace(/\s+/gu, " ").trim();
    if (paragraph) sectionParagraphs.push(paragraph);
    paragraphLines = [];
  };

  const flushSection = () => {
    flushParagraph();
    const text = sectionParagraphs.join("\n\n").trim();
    if (text) sections.push({ section: sectionName, text });
    sectionParagraphs = [];
  };

  for (const rawLine of source.split(/\r?\n/u)) {
    const line = rawLine.trim();
    const chapter = line.match(
      /^CAPÍTULO\s+([IVX]+)(?:\s+—\s+(.+))?$/iu
    );

    if (chapter) {
      flushSection();
      sectionName = `Capítulo ${chapter[1].toUpperCase()}${
        chapter[2] ? ` — ${chapter[2].trim()}` : ""
      }`;
      awaitingChapterTitle = !chapter[2];
      continue;
    }

    if (!line) {
      flushParagraph();
      continue;
    }

    if (awaitingChapterTitle) {
      if (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 ,.;:()/-]{5,}$/u.test(line)) {
        sectionName = `${sectionName} — ${line}`;
        awaitingChapterTitle = false;
        continue;
      }
      awaitingChapterTitle = false;
    }

    if (line.toUpperCase() === "REFERÊNCIAS") {
      flushSection();
      sectionName = "Referências";
      continue;
    }

    paragraphLines.push(line);
  }
  flushSection();

  const chunks = sections.flatMap(({ section, text }) =>
    splitIntoChunks(text).map((chunkText) => {
      const terms = tokenize(`${section} ${chunkText}`);
      const termFrequencies = new Map<string, number>();
      for (const term of terms) {
        termFrequencies.set(term, (termFrequencies.get(term) ?? 0) + 1);
      }
      return {
        section,
        text: chunkText,
        normalizedText: normalizeText(chunkText),
        termFrequencies,
        length: terms.length,
      };
    })
  );

  if (chunks.length === 0) {
    throw new Error(`A base local está vazia: ${KNOWLEDGE_FILE}`);
  }
  return chunks;
}

async function getIndex(): Promise<IndexedChunk[]> {
  if (!indexPromise) {
    indexPromise = buildIndex().catch((error: unknown) => {
      indexPromise = null;
      throw error;
    });
  }
  return indexPromise;
}

export async function searchLocalKnowledge(
  query: string,
  limit = 4
): Promise<KnowledgeExcerpt[]> {
  const queryTerms = [...new Set(tokenize(query))];
  if (queryTerms.length === 0) return [];

  const chunks = await getIndex();
  const averageLength =
    chunks.reduce((sum, chunk) => sum + chunk.length, 0) / chunks.length;
  const normalizedQuery = normalizeText(query);
  const k1 = 1.5;
  const b = 0.75;
  const documentFrequencies = new Map(queryTerms.map((term) => [term, 0]));
  for (const chunk of chunks) {
    for (const term of queryTerms) {
      if (chunk.termFrequencies.has(term)) {
        documentFrequencies.set(
          term,
          (documentFrequencies.get(term) ?? 0) + 1
        );
      }
    }
  }

  const ranked = chunks
    .map((chunk) => {
      let score = 0;
      for (const term of queryTerms) {
        const frequency = chunk.termFrequencies.get(term) ?? 0;
        if (!frequency) continue;

        const documentFrequency = documentFrequencies.get(term) ?? 0;
        const idf = Math.log(
          1 +
            (chunks.length - documentFrequency + 0.5) /
              (documentFrequency + 0.5)
        );
        const lengthNormalization =
          frequency +
          k1 * (1 - b + (b * chunk.length) / averageLength);
        score += (idf * frequency * (k1 + 1)) / lengthNormalization;
      }

      if (
        normalizedQuery.length >= 8 &&
        chunk.normalizedText.includes(normalizedQuery)
      ) {
        score += 2;
      }

      return { chunk, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, limit));

  return ranked.map(({ chunk }) => ({
    section: chunk.section,
    text: chunk.text,
  }));
}
