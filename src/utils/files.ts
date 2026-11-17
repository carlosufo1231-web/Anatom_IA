import type { StudyMaterial } from "../types/anatomy";

const ALLOWED_MIME_PREFIXES = ["image/"];
const ALLOWED_EXACT_MIMES = ["application/pdf"];
const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12 MB per file

export function isSupportedStudyFile(file: File): boolean {
  if (ALLOWED_EXACT_MIMES.includes(file.type)) return true;
  if (ALLOWED_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix))) {
    return true;
  }
  const lower = file.name.toLowerCase();
  return (
    lower.endsWith(".pdf") ||
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".webp")
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function readFileAsStudyMaterial(
  file: File
): Promise<StudyMaterial> {
  if (!isSupportedStudyFile(file)) {
    throw new Error(
      `Formato não suportado (${file.name}). Envie PDFs ou imagens (PNG, JPG, WebP).`
    );
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `Arquivo muito grande (${file.name}). O limite é de 12 MB por arquivo.`
    );
  }

  const mimeType =
    file.type ||
    (file.name.toLowerCase().endsWith(".pdf")
      ? "application/pdf"
      : "image/jpeg");

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(new Error(`Falha ao ler o arquivo ${file.name}.`));
    reader.readAsDataURL(file);
  });

  const commaIndex = dataUrl.indexOf(",");
  const dataBase64 = commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    mimeType,
    dataBase64,
    size: file.size,
    previewUrl: mimeType.startsWith("image/") ? dataUrl : undefined,
  };
}
