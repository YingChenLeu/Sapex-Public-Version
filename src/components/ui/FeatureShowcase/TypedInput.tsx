import { useEffect, useState } from "react";

export type TypingSequence = {
  /** Text that should be typed out. */
  text: string;
  /** Seconds since component mount when typing should start. */
  typeStart: number;
  /** Seconds per character. Defaults to 0.04. */
  charDelay?: number;
  /** If provided, the typed text disappears at this time (e.g. message sent). */
  clearAt?: number;
};

type TypedInputProps = {
  /** Text shown when no sequence is currently typed. */
  placeholder: string;
  /** One or more typing sequences played in order. */
  sequences: TypingSequence[];
  className?: string;
  textClassName?: string;
  placeholderClassName?: string;
  /** Caret colour class. Defaults to a soft white. */
  caretClassName?: string;
};

/**
 * Decorative "typing into an input" effect for the showcase demos.
 * Drives a state machine via setTimeout — pure visual, not a real input.
 */
const TypedInput = ({
  placeholder,
  sequences,
  className = "",
  textClassName = "text-white/90",
  placeholderClassName = "text-white/40",
  caretClassName = "bg-white/70",
}: TypedInputProps) => {
  const [shown, setShown] = useState("");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    const timers: number[] = [];

    sequences.forEach((seq, i) => {
      const charDelay = seq.charDelay ?? 0.04;

      Array.from(seq.text).forEach((_, charIdx) => {
        const t = window.setTimeout(
          () => {
            setShown(seq.text.slice(0, charIdx + 1));
            setActiveIdx(i);
          },
          (seq.typeStart + (charIdx + 1) * charDelay) * 1000,
        );
        timers.push(t);
      });

      if (seq.clearAt !== undefined) {
        const t = window.setTimeout(() => {
          setShown("");
          setActiveIdx(null);
        }, seq.clearAt * 1000);
        timers.push(t);
      }
    });

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [sequences]);

  const isTyping = activeIdx !== null;

  return (
    <div className={`relative whitespace-nowrap overflow-hidden ${className}`}>
      {shown ? (
        <span className={textClassName}>
          {shown}
          {isTyping && (
            <span
              className={`inline-block w-[1px] h-[1em] ml-0.5 align-middle animate-pulse ${caretClassName}`}
            />
          )}
        </span>
      ) : (
        <span className={placeholderClassName}>{placeholder}</span>
      )}
    </div>
  );
};

export default TypedInput;
