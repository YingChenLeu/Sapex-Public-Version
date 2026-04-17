import katex from "katex";
import "katex/dist/katex.min.css";
import { Fragment } from "react";

export type MathChunk =
  | { type: "text"; value: string }
  | { type: "inline"; value: string }
  | { type: "display"; value: string };

/** Split message into plain text and LaTeX segments ($inline$ and $$display$$). */
export function parseMathChunks(src: string): MathChunk[] {
  const chunks: MathChunk[] = [];
  let i = 0;
  while (i < src.length) {
    if (src.startsWith("$$", i)) {
      const end = src.indexOf("$$", i + 2);
      if (end === -1) {
        chunks.push({ type: "text", value: src.slice(i) });
        return chunks;
      }
      chunks.push({ type: "display", value: src.slice(i + 2, end) });
      i = end + 2;
      continue;
    }
    if (src[i] === "$") {
      const end = src.indexOf("$", i + 1);
      if (end === -1) {
        chunks.push({ type: "text", value: src.slice(i) });
        return chunks;
      }
      chunks.push({ type: "inline", value: src.slice(i + 1, end) });
      i = end + 1;
      continue;
    }
    const next = src.indexOf("$", i);
    if (next === -1) {
      chunks.push({ type: "text", value: src.slice(i) });
      return chunks;
    }
    if (next > i) {
      chunks.push({ type: "text", value: src.slice(i, next) });
    }
    i = next;
  }
  return chunks;
}

type MessageMathContentProps = {
  content: string;
  className?: string;
};

/**
 * Renders chat message body: plain text (preserved whitespace) + KaTeX for $...$ / $$...$$.
 */
export function MessageMathContent({
  content,
  className = "",
}: MessageMathContentProps) {
  const chunks = parseMathChunks(content);

  return (
    <span
      className={`problem-chat-math inline [&_.katex]:text-inherit [&_.katex-html]:text-inherit ${className}`}
    >
      {chunks.map((chunk, idx) => {
        if (chunk.type === "text") {
          return (
            <span key={idx} className="whitespace-pre-wrap break-words">
              {chunk.value}
            </span>
          );
        }
        const latex = chunk.value.trim();
        if (!latex) {
          return <Fragment key={idx} />;
        }
        try {
          const html = katex.renderToString(latex, {
            throwOnError: false,
            displayMode: chunk.type === "display",
            output: "html",
            strict: "ignore",
            trust: false,
          });
          if (chunk.type === "display") {
            return (
              <span
                key={idx}
                className="my-1 block w-full min-w-0 overflow-x-auto text-center [&_.katex-display]:m-0"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }
          return (
            <span
              key={idx}
              className="mx-0.5 inline-block max-w-full align-baseline [&_.katex]:text-[0.95em]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <span key={idx} className="whitespace-pre-wrap font-mono text-xs opacity-80">
              {chunk.type === "display" ? `$$${chunk.value}$$` : `$${chunk.value}$`}
            </span>
          );
        }
      })}
    </span>
  );
}
