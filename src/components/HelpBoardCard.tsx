"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useEffect, useState } from "react";
import { DisplayImage } from "./DisplayImage";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";


type Problem = {
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
  likes: number;
};

const urgencyColors: Record<Problem["urgency"], string> = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

interface HelpBoardCardProps {
  problem: Problem;
  onHelpClick: (problem: Problem) => void;
}

export const HelpBoardCard = ({ problem, onHelpClick }: HelpBoardCardProps) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect(() => {
    const fetchMessageCount = async () => {
      if (!problem?.id) return;
      const messagesRef = collection(db, "problems", problem.id, "messages");
      const snapshot = await getDocs(messagesRef);
      setMessageCount(snapshot.size); // snapshot.size = number of docs
    };
  
    fetchMessageCount();
  }, [problem?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{
        y: -4,
        scale: 1.02,
        boxShadow:
          "0 18px 45px -24px rgba(0,0,0,0.9), 0 0 0 1px rgba(124,220,189,0.08)",
      }}
      className="relative"
    >
      <Card
        className="h-full flex flex-col w-auto cursor-pointer bg-[#101320] border border-[#1b1f30] hover:border-[#7CDCBD]/50 transition-colors duration-200 rounded-2xl overflow-hidden"
        onClick={() => onHelpClick(problem)}
      >
        {/* Header */}
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start mb-3 gap-2">
            <div className="flex flex-col gap-1 min-w-0">
              <Badge className="w-fit bg-[#181c2c] text-xs font-medium text-slate-200/90 border border-slate-600/40">
                {problem.course}
              </Badge>
              <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
                {problem.category}
              </span>
            </div>
            <Badge
              className={`px-2 py-1 rounded-full text-[11px] font-semibold border-0 ${urgencyColors[problem.urgency]} bg-opacity-20`}
            >
              {problem.urgency.charAt(0).toUpperCase() + problem.urgency.slice(1)}{" "}
              urgency
            </Badge>
          </div>
          <CardTitle className="text-base sm:text-lg text-white line-clamp-2 leading-snug">
            {problem.title}
          </CardTitle>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-grow overflow-hidden">
          <p className="text-muted-foreground text-sm max-h-24 overflow-y-auto pr-1 custom-scrollbar leading-relaxed">
            {problem.description}
          </p>

          {/* Image Popup Dialog */}
          {problem.image && (
            <div className="mt-3">
              <DisplayImage
                isOpen={isImageDialogOpen}
                onClose={() => setIsImageDialogOpen(false)}
                imageUrl={problem.image}
              />
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col border-t border-discord-border pt-4 gap-4">
          <div className="flex items-center justify-between w-full">
            {/* User info */}
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-7 w-7 ring-2 ring-[#7CDCBD]/40 ring-offset-2 ring-offset-[#0c0f1a]">
                {problem.user?.avatar ? (
                  <AvatarImage
                    src={problem.user.avatar}
                    loading="eager"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {problem.user?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm text-slate-100 truncate">
                  {problem.user.name}
                </span>
                <span className="text-[11px] text-slate-500">
                  {problem.createdAt
                    ? formatDistanceToNow(problem.createdAt, { addSuffix: true })
                    : "Just now"}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageCircle size={14} className="text-[#7CDCBD]" />
                <span className="font-medium">{messageCount}</span>
              </div>
              {problem.image ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageDialogOpen(true);
                  }}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 hover:border-[#7CDCBD]/40 hover:bg-white/10 transition-colors"
                  title="View attachment"
                >
                  <motion.span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0A0D17]/60 border border-white/10"
                    whileHover={{ rotate: -8, scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  >
                    <Paperclip size={14} className="text-[#D8DEDE]/90" />
                  </motion.span>
                  <span className="font-medium text-[#D8DEDE]/85 group-hover:text-white">
                    Attachment
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-1 opacity-70">
                  <Paperclip size={14} />
                  <span>No attachment</span>
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
