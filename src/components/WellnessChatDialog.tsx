import { useState, useRef, useEffect, useMemo } from "react";
import CampsBay from "@/assets/CampsBay.png";
import Freedom from "@/assets/Freedom.png";
import Frozen from "@/assets/Frozen.png";
import Lake from "@/assets/Lake.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Smile, UserRound } from "lucide-react";
import { useSidebar } from "./SideBar";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { resolveUserAvatarUrl } from "@/lib/profileVisuals";
// Message type for wellness chat, similar to ProblemChatDialog
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

type WellnessChatDialogProps = {
  sessionId: string;
  isOpen: boolean;
  onClose: () => void;
};

const WellnessChatDialog = ({
  sessionId,
}: WellnessChatDialogProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { collapsed } = useSidebar();

  const [, setHelperInfo] = useState<{
    name: string;
    avatar?: string;
  } | null>(null);

  const helperUidRef = useRef<string | null>(null);
  // Pick a random background image once per mount
  const backgroundImage = useMemo(() => {
    const images = [CampsBay, Freedom, Frozen, Lake];
    return images[Math.floor(Math.random() * images.length)];
  }, []);

  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textAreaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchHelperInfo = async () => {
      const docRef = doc(db, "esupport", sessionId);
      const sessionSnap = await getDoc(docRef);
      const helperUid = sessionSnap.data()?.helper_uid;
      helperUidRef.current = helperUid;
      if (helperUid && currentUser?.uid !== helperUid) {
        const helperSnap = await getDoc(doc(db, "users", helperUid));
        if (helperSnap.exists()) {
          const data = helperSnap.data();
          setHelperInfo({
            name: data.displayName || "Supporter",
            avatar: resolveUserAvatarUrl(data) || undefined,
          });
        }
      }
    };
    fetchHelperInfo();
  }, [sessionId, currentUser]);


  useEffect(() => {
    if (!sessionId) return;
    const messagesRef = collection(db, "esupport", sessionId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to Firestore (esupport collection, aligned with ProblemChatDialog)
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    let avatar: string | null = null;
    if (currentUser?.uid) {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        avatar = resolveUserAvatarUrl(data);
      }
    }
    await addDoc(collection(db, "esupport", sessionId, "messages"), {
      content: newMessage.trim(),
      createdAt: serverTimestamp(),
      user: {
        name: currentUser.displayName || "Anonymous",
        avatar,
        uid: currentUser.uid,
      },
    });
    setNewMessage("");
  };

  // Format time for display
  const formatTime = (createdAt: any) => {
    if (!createdAt?.seconds) return "just now";
    const date = new Date(createdAt.seconds * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div
      className={`h-screen w-full flex flex-col ${
        collapsed ? "pl-[80px]" : "pl-[240px]"
      } transition-all duration-300`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="bg-[#1e212d] border-b border-discord-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-green-800 rounded-full flex items-center justify-center">
            <UserRound className="text-white h-5 w-5" />
          </div>
          <div>
            <h3 className="text-white font-medium">Sapex Emotional Support</h3>
          </div>
          {currentUser?.uid !== helperUidRef.current && (
            <Button
              size="sm"
              onClick={() => setShowRatingPrompt(true)}
              className="ml-auto text-sm text-white bg-green-600 hover:bg-green-700"
            >
              Resolve Issue
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/helpboard")}
          className="text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {showRatingPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-[#1e212d] p-6 rounded-lg shadow-lg w-[320px] text-white text-center"
          >
            <h3 className="text-lg font-semibold mb-2">How much better do you feel now?</h3>
            <p className="text-sm text-slate-400 mb-4">Rate on a scale of 1 to 10</p>
            <div className="flex justify-center space-x-2 mb-4">
              {[...Array(10)].map((_, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedRating(i + 1)}
                  className={`w-10 h-8 rounded-full border ${
                    selectedRating === i + 1
                      ? "bg-green-600 border-green-400 text-white"
                      : "bg-slate-700 border-slate-500 text-white"
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
            <Button
              onClick={async () => {
                if (selectedRating !== null) {
                  await updateDoc(doc(db, "esupport", sessionId), {
                    actual: selectedRating / 10,
                  });
                  if (helperUidRef.current) {
                    await updateDoc(doc(db, "users", helperUidRef.current), {
                      busy: false,
                    });
                  }
                }
                setShowRatingPrompt(false);
                navigate("/helpboard");
              }}
              disabled={selectedRating === null}
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              Submit
            </Button>
          </motion.div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.user.uid === currentUser?.uid
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
              {currentUser?.uid !== helperUidRef.current && message.user.uid !== currentUser?.uid && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-green-800 rounded-full flex items-center justify-center flex-shrink-0">
                  {message.user.avatar ? (
                    <img
                      src={message.user.avatar}
                      alt={message.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserRound className="text-white h-4 w-4" />
                  )}
                </div>
              )}
              <div className="flex flex-col">
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.user.uid === currentUser?.uid
                      ? "bg-discord-primary text-white rounded-br-md"
                      : "bg-discord-sidebar text-white rounded-bl-md"
                  }`}
                >
                  <p className="text-sm rounded-2xl px-4 py-2 w-fit max-w-[500px] break-words bg-green-400/20 text-green-200">
                    {message.content}
                  </p>
                </div>
                <span className={`text-xs text-slate-400 mt-1 px-1 ${message.user.uid === currentUser?.uid ? "text-right" : "text-left"}`}>
                  {formatTime(message.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-[#1e212d] border-t border-discord-border p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(prev => !prev)}
            className="text-slate-400 hover:text-white hover:bg-slate-700 relative"
          >
            <Smile className="h-5 w-5" />
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-30">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    const emoji = emojiData.emoji;
                    const start = textAreaRef.current?.selectionStart || 0;
                    const end = textAreaRef.current?.selectionEnd || 0;
                    const text = newMessage;
                    const updatedText = text.slice(0, start) + emoji + text.slice(end);
                    setNewMessage(updatedText);

                    setTimeout(() => {
                      textAreaRef.current?.focus();
                      textAreaRef.current?.setSelectionRange(
                        start + emoji.length,
                        start + emoji.length
                      );
                    }, 0);
                  }}
                  theme={Theme.DARK}
                />
              </div>
            )}
          </Button>
          <Input
            ref={textAreaRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-discord-sidebar border-none text-white placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          This is a safe space. Your conversation is private and anonymous. The
          data will only be used to improve our services and will not be shared
          with third parties.
        </p>
      </div>
    </div>
  );
};

export default WellnessChatDialog;
