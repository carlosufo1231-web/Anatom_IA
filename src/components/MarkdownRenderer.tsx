import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-slate-100 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-4 mb-2 text-lg font-bold text-white border-b border-[#0088FF]/30 pb-1.5">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-4 mb-2 text-base font-bold text-[#00E5FF]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-3 mb-1.5 text-sm font-bold text-[#76FF03]">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-[#00E5FF]">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#76FF03]">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="my-2 space-y-1.5 pl-5 list-disc marker:text-[#00E640]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 space-y-1.5 pl-5 list-decimal marker:text-[#00E5FF] marker:font-mono">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 rounded-xl border border-[#00E640]/40 bg-[#00E640]/[0.07] px-4 py-3 text-slate-100">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-[#0088FF]/30 bg-[#040B14]/75">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#091526] text-[#00E5FF] border-b border-[#0088FF]/35">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 text-xs font-bold tracking-wide">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2.5 border-t border-[#0088FF]/15 text-slate-200 tabular-nums">
              {children}
            </td>
          ),
          code: ({ className, children }) => {
            const isBlock = Boolean(className);
            if (isBlock) {
              return (
                <code className="block overflow-x-auto rounded-lg border border-[#0088FF]/25 bg-[#040B14] p-3 text-xs font-mono text-[#76FF03]">
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-[#040B14] px-1.5 py-0.5 text-xs font-mono text-[#00E5FF] border border-[#0088FF]/25">
                {children}
              </code>
            );
          },
          hr: () => <hr className="my-4 border-[#0088FF]/20" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
