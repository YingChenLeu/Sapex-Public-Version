"use client";

import { useState, useEffect, useRef } from "react";
import { AtSign, Smile, Trash, CircleUserRound, Loader2 } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Sigma } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db, app } from "@/lib/firebase";
import { getStorage, ref, deleteObject } from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AnimatePresence, motion } from "framer-motion";
import { MessageMathContent } from "@/components/MessageMathContent";
dayjs.extend(relativeTime);

/** Escape `{` / `}` so user text inside our LaTeX templates cannot break delimiters. */
function escapeForEmbeddedMath(s: string): string {
  return s.replace(/\{/g, "\\{").replace(/\}/g, "\\}");
}

type MathParamField = {
  key: string;
  label: string;
  default: string;
  placeholder?: string;
  maxLength?: number;
};

type MathSnippetDef =
  | { id: string; label: string; simple: true; value: string }
  | {
      id: string;
      label: string;
      simple: false;
      builderTitle: string;
      fields: MathParamField[];
      build: (values: Record<string, string>) => string;
      /** Plain-language hint under the title (no LaTeX). */
      builderHint?: string;
    };

const MATH_SNIPPET_DEFS: MathSnippetDef[] = [
  {
    id: "integral",
    label: "∫",
    simple: false,
    builderTitle: "Integral",
    builderHint:
      "UB: upper limit · LB: lower limit. Leave both blank for a plain integral, or fill both for a definite integral.",
    fields: [
      {
        key: "lb",
        label: "LB",
        default: "",
        placeholder: "Lower bound",
        maxLength: 24,
      },
      {
        key: "ub",
        label: "UB",
        default: "",
        placeholder: "Upper bound",
        maxLength: 24,
      },
    ],
    build: (v) => {
      const lb = escapeForEmbeddedMath((v.lb ?? "").trim());
      const ub = escapeForEmbeddedMath((v.ub ?? "").trim());
      if (lb && ub) {
        return `$\\displaystyle\\int_{${lb}}^{${ub}}$`;
      }
      return "$\\displaystyle\\int$";
    },
  },
  { id: "dx", label: "dx", simple: true, value: "$\\mathrm{d}x$" },
  {
    id: "dydx",
    label: "dy/dx",
    simple: true,
    value: "$\\dfrac{\\mathrm{d}y}{\\mathrm{d}x}$",
  },
  { id: "xsq", label: "x²", simple: true, value: "$x^2$" },
  {
    id: "sqrt",
    label: "√",
    simple: false,
    builderTitle: "Square root",
    fields: [
      {
        key: "inner",
        label: "Inside the root",
        default: "",
        placeholder: "Expression",
        maxLength: 64,
      },
    ],
    build: (v) => {
      const inner = escapeForEmbeddedMath((v.inner ?? "").trim());
      const body = inner || "\\phantom{x}";
      return `$\\sqrt{${body}}$`;
    },
  },
  {
    id: "lim",
    label: "lim",
    simple: false,
    builderTitle: "Limit",
    fields: [
      {
        key: "var",
        label: "Variable",
        default: "x",
        placeholder: "x",
        maxLength: 12,
      },
      {
        key: "to",
        label: "Goes to",
        default: "0",
        placeholder: "0, infinity, …",
        maxLength: 32,
      },
    ],
    build: (v) => {
      const variable = escapeForEmbeddedMath((v.var ?? "x").trim()) || "x";
      const approaches = escapeForEmbeddedMath((v.to ?? "0").trim()) || "0";
      return `$\\lim\\limits_{${variable} \\to ${approaches}}$`;
    },
  },
  {
    id: "frac",
    label: "a/b",
    simple: false,
    builderTitle: "Fraction",
    fields: [
      {
        key: "num",
        label: "Top",
        default: "",
        placeholder: "Top number",
        maxLength: 64,
      },
      {
        key: "den",
        label: "Bottom",
        default: "",
        placeholder: "Bottom number",
        maxLength: 64,
      },
    ],
    build: (v) => {
      const num = escapeForEmbeddedMath((v.num ?? "").trim()) || "\\phantom{0}";
      const den = escapeForEmbeddedMath((v.den ?? "").trim()) || "\\phantom{0}";
      return `$\\dfrac{${num}}{${den}}$`;
    },
  },
  { id: "infty", label: "∞", simple: true, value: "$\\infty$" },
];

type Message = {
  id: string;
  content: string;
  createdAt: any;
  user: {
    name: string;
    avatar?: string;
    uid?: string;
  };
};

type ProblemChatDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  problem: {
    id: string;
    title: string;
    description: string;
    category: string;
    course: string;
    urgency: "low" | "medium" | "high";
    image?: string | null;
    createdAt: Date | null;
    user: {
      name: string;
      avatar?: string;
      uid?: string;
    };
    responses: number;
  };
};

export const ProblemChatDialog = ({
  isOpen,
  onClose,
  problem,
}: ProblemChatDialogProps) => {
  const [showCalcBar, setShowCalcBar] = useState(false);
  const [mathBuilderId, setMathBuilderId] = useState<string | null>(null);
  const [mathBuilderFields, setMathBuilderFields] = useState<
    Record<string, string>
  >({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [mentionOptions, setMentionOptions] = useState<
    { name: string; avatar?: string }[]
  >([]);
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const sendingRef = useRef(false);

  const [isSending, setIsSending] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!isOpen) {
      sendingRef.current = false;
      setIsSending(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!showCalcBar) setMathBuilderId(null);
  }, [showCalcBar]);

  useEffect(() => {
    if (!mathBuilderId) return;
    const def = MATH_SNIPPET_DEFS.find((d) => d.id === mathBuilderId);
    if (!def || def.simple) return;
    const init: Record<string, string> = {};
    def.fields.forEach((f) => {
      init[f.key] = f.default;
    });
    setMathBuilderFields(init);
  }, [mathBuilderId]);

  // Active users
  useEffect(() => {
    if (!problem?.id || !currentUser) return;

    const activeUserRef = doc(
      db,
      "problems",
      problem.id,
      "activeUsers",
      currentUser.uid,
    );

    const setActive = async () => {
      let avatar = null;
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        avatar = userDoc.data().profilePicture || null;
      }
      await setDoc(activeUserRef, {
        name: currentUser.displayName || "Anonymous",
        avatar,
        uid: currentUser.uid,
        lastActive: serverTimestamp(),
      });
    };

    setActive();

    return () => {
      deleteDoc(activeUserRef);
    };
  }, [problem?.id, currentUser]);

  // Load messages
  useEffect(() => {
    if (!problem?.id) return;

    const messagesRef = collection(db, "problems", problem.id, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [problem?.id]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Active users listener
  useEffect(() => {
    if (!problem?.id) return;

    const usersRef = collection(db, "problems", problem.id, "activeUsers");

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const count = snapshot.docs.length;
      setActiveUsers(count);

      const names = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { name: data.name, avatar: data.avatar || null };
      });
      setMentionOptions(names);
    });

    return () => unsubscribe();
  }, [problem?.id]);

  // Typing users
  useEffect(() => {
    if (!problem?.id) return;

    const typingRef = collection(db, "problems", problem.id, "typing");

    const unsubscribe = onSnapshot(typingRef, (snap) => {
      const usersTyping: { [key: string]: string } = {};

      snap.forEach((doc) => {
        const { name, lastTyped } = doc.data() as {
          name: string;
          lastTyped: any;
        };
        const secondsAgo = Date.now() / 1000 - lastTyped?.seconds;
        if (secondsAgo < 5) {
          usersTyping[doc.id] = name || "Anonymous";
        }
      });

      const filtered = Object.entries(usersTyping)
        .filter(([uid]) => uid !== currentUser?.uid)
        .map(([, name]) => name);

      setTypingUsers(filtered);
    });

    return () => unsubscribe();
  }, [problem?.id, currentUser?.uid]);

  const handleSendMessage = async () => {
    const text = newMessage.trim();
    if (!text || !currentUser) return;
    if (sendingRef.current) return;

    sendingRef.current = true;
    setIsSending(true);

    try {
      let avatar = null;
      if (currentUser.uid) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          avatar = userDoc.data().profilePicture || null;
        }
      }

      await addDoc(collection(db, "problems", problem.id, "messages"), {
        content: text,
        createdAt: serverTimestamp(),
        user: {
          name: currentUser.displayName || "Anonymous",
          avatar,
          uid: currentUser.uid,
        },
      });

      setNewMessage("");
      setShowMentionList(false);
      await deleteDoc(
        doc(db, "problems", problem.id, "typing", currentUser.uid),
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      sendingRef.current = false;
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!currentUser) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (sendingRef.current) return;
      void handleSendMessage();
      return;
    }

    setDoc(doc(db, "problems", problem.id, "typing", currentUser.uid), {
      name: currentUser.displayName || "Someone",
      lastTyped: serverTimestamp(),
    });
    if (e.key === "Tab" && showMentionList) {
      e.preventDefault();
      if (mentionOptions.length > 0) {
        insertMention(mentionOptions[0].name);
      }
    }
  };

  const insertMention = (username: string) => {
    if (!textAreaRef.current) return;
    const text = newMessage;
    const before = text.substring(0, cursorPosition);
    const after = text.substring(cursorPosition);
    const lastAt = before.lastIndexOf("@");
    const newText = before.substring(0, lastAt + 1) + username + " " + after;
    setNewMessage(newText);
    setShowMentionList(false);
    setTimeout(() => {
      textAreaRef.current?.focus();
      const pos = lastAt + username.length + 2;
      textAreaRef.current?.setSelectionRange(pos, pos);
    }, 0);
  };

  const insertLatexAtCursor = (latex: string) => {
    const ta = textAreaRef.current;
    const start = ta?.selectionStart ?? cursorPosition;
    const end = ta?.selectionEnd ?? cursorPosition;
    const text = newMessage;
    const updatedText =
      text.substring(0, start) + latex + text.substring(end);
    setNewMessage(updatedText);
    setTimeout(() => {
      textAreaRef.current?.focus();
      const pos = start + latex.length;
      textAreaRef.current?.setSelectionRange(pos, pos);
    }, 0);
  };

  const handleDeletePost = async () => {
    if (!problem?.id) return;

    // Delete associated image from Firebase Storage if present
    if (
      problem.image &&
      problem.image.includes("firebasestorage.googleapis.com")
    ) {
      try {
        const url = new URL(problem.image);
        const pathMatch = url.pathname.match(/\/o\/(.+)$/);
        if (pathMatch) {
          const fullPath = decodeURIComponent(pathMatch[1]);
          const storage = getStorage(app);
          const storageRef = ref(storage, fullPath);
          await deleteObject(storageRef);
        }
      } catch (err) {
        console.error("Failed to delete problem image from Storage:", err);
        // Continue to delete Firestore doc even if Storage delete fails
      }
    }

    const messagesRef = collection(db, "problems", problem.id, "messages");
    const snapshot = await getDocs(messagesRef);

    const category = problem.category;

    // Use a Set to ensure each user's contribution is only logged once per post deletion
    const uniqueUserIds = new Set<string>();
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const uid = data?.user?.uid;
      if (uid) {
        uniqueUserIds.add(uid);
      }
    });

    await Promise.all(
      Array.from(uniqueUserIds).map((uid) =>
        setDoc(doc(db, "users", uid, "contributions", problem.id), {
          category,
          timestamp: serverTimestamp(),
        }),
      ),
    );

    await deleteDoc(doc(db, "problems", problem.id));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 bg-[#11141d] text-white">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="problem-dialog"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onAnimationComplete={(definition) => {
                if (definition === "exit") onClose();
              }}
              className="flex flex-col h-full"
            >
              <DialogHeader className="px-6 py-4 border-b border-discord-border flex-shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-xl font-semibold line-clamp-2">
                      {problem.title}
                    </DialogTitle>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-discord-primary/15 text-discord-primary px-2 py-0.5 rounded-full">
                        {problem.course}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full uppercase tracking-wide text-[10px] ${
                          problem.urgency === "high"
                            ? "bg-red-500/20 text-red-300"
                            : problem.urgency === "medium"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {problem.urgency} urgency
                      </span>
                      <span className="text-xs text-gray-400">
                        Help {problem.user.name} solve their problem
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="inline-flex items-center gap-1 rounded-full bg-[#181c27] px-3 py-1 text-xs">
                      <CircleUserRound className="h-3 w-3 text-emerald-400" />
                      <span className="font-semibold text-white">
                        {Math.max(0, activeUsers - 1)}
                      </span>
                      <span className="text-[11px] text-gray-400">online</span>
                    </div>
                    {currentUser?.uid === problem.user.uid && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Delete this post for everyone? This cannot be undone.",
                            )
                          ) {
                            handleDeletePost();
                          }
                        }}
                        className="flex items-center gap-1 border-red-500/40 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                      >
                        <Trash size={14} />
                        <span className="text-xs font-medium">Delete post</span>
                      </Button>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 space-y-1 custom-scrollbar bg-[#0d1019]">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-sm text-gray-500">
                    <p className="text-gray-400">No messages yet</p>
                    <p className="mt-1 max-w-xs text-xs text-gray-600">
                      Say hello and share how you can help — messages appear here
                      as bubbles.
                    </p>
                  </div>
                )}
                {messages.map((message, idx) => {
                  const senderUid = message.user?.uid;
                  const isOwn =
                    !!currentUser?.uid && senderUid === currentUser.uid;
                  const displayName = isOwn ? "You" : message.user.name;
                  const prev = messages[idx - 1];
                  const showAvatar =
                    !prev || prev.user?.uid !== senderUid || idx === 0;
                  const compactTop = !showAvatar && idx > 0;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`flex items-end gap-2.5 ${
                        isOwn ? "flex-row-reverse" : ""
                      } ${compactTop ? "mt-0.5" : "mt-3"}`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 ${showAvatar ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                        aria-hidden={!showAvatar}
                      >
                        {showAvatar ? (
                          <Avatar
                            className={`h-8 w-8 ring-2 ring-black/25 ${
                              isOwn
                                ? "ring-emerald-400/20"
                                : "ring-violet-400/20"
                            }`}
                          >
                            {message.user.avatar ? (
                              <AvatarImage
                                src={message.user.avatar}
                                alt={message.user.name || "User"}
                              />
                            ) : (
                              <AvatarFallback className="bg-[#2a3142] text-gray-200">
                                <CircleUserRound className="w-4 h-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                        ) : (
                          <div className="h-8 w-8" />
                        )}
                      </div>
                      <div
                        className={`flex flex-col min-w-0 max-w-[min(85%,28rem)] ${
                          isOwn ? "items-end" : "items-start"
                        }`}
                      >
                        {showAvatar && (
                          <div
                            className={`flex items-baseline gap-2 mb-1 px-1 text-[11px] ${
                              isOwn ? "flex-row-reverse" : ""
                            }`}
                          >
                            <span className="font-semibold text-gray-200 truncate max-w-[12rem]">
                              {displayName}
                            </span>
                            <span className="tabular-nums text-gray-500 shrink-0">
                              {message.createdAt?.seconds
                                ? dayjs
                                    .unix(message.createdAt.seconds)
                                    .fromNow()
                                : "now"}
                            </span>
                          </div>
                        )}
                        <div
                          className={[
                            "relative px-3.5 py-2.5 text-[0.9375rem] leading-relaxed w-fit max-w-full",
                            "rounded-[1.35rem] break-words whitespace-pre-wrap text-gray-200",
                            "bg-transparent border",
                            isOwn
                              ? "rounded-br-[0.65rem] border-emerald-400/35 text-gray-200 shadow-[0_0_22px_-10px_rgba(52,211,153,0.32)]"
                              : "rounded-bl-[0.65rem] border-violet-400/30 text-gray-200 shadow-[0_0_22px_-10px_rgba(167,139,250,0.25)]",
                          ].join(" ")}
                        >
                          <MessageMathContent content={message.content} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {typingUsers.length > 0 && (
                  <div className="px-4 text-xs text-muted-foreground animate-pulse">
                    {typingUsers.join(", ")}{" "}
                    {typingUsers.length === 1 ? "is" : "are"} typing...
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="shrink-0 overflow-visible border-t border-white/[0.08] bg-[#11141d]/95 px-3 py-3 sm:px-4">
                <div className="relative z-0 mx-auto max-w-full overflow-visible">
                  {showMentionList && (
                    <div className="absolute bottom-full left-0 z-30 mb-2 w-[min(100%,16rem)] max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-[#1a1f2e] p-1 shadow-xl shadow-black/40 custom-scrollbar">
                      {mentionOptions
                        .filter((option) =>
                          option.name
                            .toLowerCase()
                            .includes(mentionQuery.toLowerCase()),
                        )
                        .map((option, idx) => (
                          <div
                            key={idx}
                            className="flex cursor-pointer items-center rounded-lg px-2 py-1.5 text-sm text-gray-200 hover:bg-white/10"
                            onClick={() => insertMention(option.name)}
                          >
                            {option.avatar ? (
                              <Avatar className="mr-2 h-5 w-5">
                                <AvatarImage
                                  src={option.avatar}
                                  alt={option.name}
                                />
                                <AvatarFallback>{option.name[0]}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs">
                                {option.name[0]}
                              </div>
                            )}
                            @{option.name}
                          </div>
                        ))}
                    </div>
                  )}

                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 z-30 mb-2 max-h-[min(50vh,320px)] overflow-hidden rounded-xl border border-white/10 shadow-xl shadow-black/40">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          const emoji = emojiData.emoji;
                          const start =
                            textAreaRef.current?.selectionStart || 0;
                          const end = textAreaRef.current?.selectionEnd || 0;
                          const text = newMessage;
                          const updatedText =
                            text.substring(0, start) +
                            emoji +
                            text.substring(end);
                          setNewMessage(updatedText);
                          setShowEmojiPicker(false);
                          setTimeout(() => {
                            textAreaRef.current?.focus();
                            textAreaRef.current?.setSelectionRange(
                              start + emoji.length,
                              start + emoji.length,
                            );
                          }, 0);
                        }}
                        theme={Theme.DARK}
                      />
                    </div>
                  )}

                  <div className="overflow-visible rounded-xl border border-white/[0.1] bg-[#0d1019] shadow-inner shadow-black/20 focus-within:border-[#7cdcbd]/35 focus-within:ring-2 focus-within:ring-[#7cdcbd]/20">
                    <div className="overflow-hidden rounded-t-xl">
                      <Textarea
                        ref={textAreaRef}
                        value={newMessage}
                        onChange={(e) => {
                          const value = e.target.value;
                          const caret = e.target.selectionStart || 0;
                          setNewMessage(value);
                          setCursorPosition(caret);

                          const textUntilCursor = value.slice(0, caret);
                          const lastAt = textUntilCursor.lastIndexOf("@");

                          if (lastAt !== -1) {
                            const query = textUntilCursor.slice(lastAt + 1);
                            if (query.length >= 0) {
                              setMentionQuery(query);
                              setShowMentionList(true);
                            } else {
                              setShowMentionList(false);
                            }
                          } else {
                            setShowMentionList(false);
                          }
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Message…"
                        disabled={isSending}
                        rows={1}
                        className="max-h-[min(40vh,240px)] min-h-[52px] w-full resize-none rounded-none border-0 bg-transparent px-3.5 py-3 text-[15px] leading-relaxed text-gray-100 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60 sm:px-4 sm:text-[0.9375rem]"
                      />
                    </div>

                    <div className="relative z-10 flex items-center gap-2 overflow-visible rounded-b-xl border-t border-white/[0.06] bg-[#0a0c12]/90 px-2 py-1.5 sm:px-3">
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-0.5 sm:gap-1">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
                          title="Mention"
                          onClick={() => {
                            if (!textAreaRef.current) return;
                            const start =
                              textAreaRef.current.selectionStart || 0;
                            const end = textAreaRef.current.selectionEnd || 0;
                            const text = newMessage;
                            const updatedText =
                              text.substring(0, start) +
                              "@" +
                              text.substring(end);
                            setNewMessage(updatedText);
                            setTimeout(() => {
                              textAreaRef.current?.focus();
                              textAreaRef.current?.setSelectionRange(
                                start + 1,
                                start + 1,
                              );
                            }, 0);
                          }}
                        >
                          <AtSign className="h-[18px] w-[18px]" />
                        </button>
                        {problem.category.toLowerCase() === "mathematics" && (
                          <div className="relative z-20">
                            <button
                              type="button"
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
                              title="Insert math"
                              onClick={() => {
                                setShowEmojiPicker(false);
                                setShowCalcBar((prev) => !prev);
                              }}
                            >
                              <Sigma className="h-[18px] w-[18px]" />
                            </button>
                            {showCalcBar && (
                              <div
                                className={`absolute bottom-full left-0 z-[60] mb-2 flex flex-col gap-2 rounded-xl border border-white/10 bg-[#1a1f2e] p-2.5 shadow-2xl shadow-black/50 ${
                                  mathBuilderId
                                    ? "max-w-[min(100vw-2rem,28rem)] min-w-[min(100vw-2rem,20rem)]"
                                    : "max-w-[min(100vw-2rem,22rem)]"
                                }`}
                              >
                                <div className="flex flex-wrap gap-1">
                                  {MATH_SNIPPET_DEFS.map((item) => (
                                    <button
                                      key={item.id}
                                      type="button"
                                      className={`rounded-md px-2 py-1 text-xs text-gray-200 hover:bg-[#7cdcbd]/20 hover:text-white ${
                                        mathBuilderId === item.id
                                          ? "bg-[#7cdcbd]/25 ring-1 ring-[#7cdcbd]/40"
                                          : "bg-white/[0.06]"
                                      }`}
                                      onClick={() => {
                                        if (item.simple) {
                                          setMathBuilderId(null);
                                          insertLatexAtCursor(item.value);
                                          setShowCalcBar(false);
                                        } else {
                                          setMathBuilderId((prev) =>
                                            prev === item.id ? null : item.id,
                                          );
                                        }
                                      }}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                                {mathBuilderId &&
                                  (() => {
                                    const def = MATH_SNIPPET_DEFS.find(
                                      (d) => d.id === mathBuilderId,
                                    );
                                    if (!def || def.simple) return null;
                                    return (
                                      <div className="mt-2 space-y-2 border-t border-white/10 pt-2.5">
                                        <p className="text-xs font-medium text-gray-200">
                                          {def.builderTitle}
                                        </p>
                                        {def.builderHint ? (
                                          <p className="text-[11px] leading-relaxed text-gray-500">
                                            {def.builderHint}
                                          </p>
                                        ) : null}
                                        <div className="grid gap-2 sm:grid-cols-2">
                                          {def.fields.map((f) => (
                                            <div
                                              key={f.key}
                                              className="space-y-1 sm:col-span-1"
                                            >
                                              <Label
                                                htmlFor={`math-${def.id}-${f.key}`}
                                                className="text-[11px] text-gray-400"
                                              >
                                                {f.label}:
                                              </Label>
                                              <Input
                                                id={`math-${def.id}-${f.key}`}
                                                value={
                                                  mathBuilderFields[f.key] ??
                                                  ""
                                                }
                                                onChange={(e) =>
                                                  setMathBuilderFields(
                                                    (prev) => ({
                                                      ...prev,
                                                      [f.key]: e.target.value,
                                                    }),
                                                  )
                                                }
                                                placeholder={f.placeholder}
                                                maxLength={f.maxLength}
                                                className="h-8 border-white/10 bg-black/25 text-xs text-gray-100 placeholder:text-gray-600 focus-visible:ring-[#7cdcbd]/30"
                                              />
                                            </div>
                                          ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          <Button
                                            type="button"
                                            size="sm"
                                            className="h-8 bg-[#7cdcbd] text-xs text-[#0a0d17] hover:bg-[#5fbfaa]"
                                            onClick={() => {
                                              const built = def.build(
                                                mathBuilderFields,
                                              );
                                              insertLatexAtCursor(built);
                                              setMathBuilderId(null);
                                              setShowCalcBar(false);
                                            }}
                                          >
                                            Insert
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-xs text-gray-400 hover:bg-white/[0.06] hover:text-white"
                                            onClick={() =>
                                              setMathBuilderId(null)
                                            }
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  })()}
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
                          title="Emoji"
                          onClick={() => {
                            setShowCalcBar(false);
                            setShowEmojiPicker((prev) => !prev);
                          }}
                        >
                          <Smile className="h-[18px] w-[18px]" />
                        </button>
                      </div>

                      <p className="hidden shrink-0 text-[10px] text-gray-600 sm:block md:text-[11px]">
                        <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 py-0.5 font-mono text-[9px] text-gray-500">
                          Enter
                        </kbd>{" "}
                        send ·{" "}
                        <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 py-0.5 font-mono text-[9px] text-gray-500">
                          Shift+Enter
                        </kbd>{" "}
                        new line
                      </p>

                      <button
                        type="button"
                        disabled={!newMessage.trim() || isSending}
                        onClick={() => void handleSendMessage()}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7cdcbd] text-[#0a0d17] transition hover:bg-[#5fbfaa] disabled:bg-zinc-700 disabled:text-zinc-400"
                        aria-label={isSending ? "Sending…" : "Send message"}
                      >
                        {isSending ? (
                          <Loader2
                            className="h-4 w-4 animate-spin text-[#0a0d17]"
                            aria-hidden
                          />
                        ) : (
                          <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-[18px] w-[18px]"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <motion.path
                              d="M5 12l14 0"
                              initial={{
                                strokeDasharray: "50%",
                                strokeDashoffset: "50%",
                              }}
                              animate={{
                                strokeDashoffset: newMessage.trim()
                                  ? 0
                                  : "50%",
                              }}
                              transition={{
                                duration: 0.3,
                                ease: "linear",
                              }}
                            />
                            <path d="M13 18l6 -6" />
                            <path d="M13 6l6 6" />
                          </motion.svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
export default ProblemChatDialog;
