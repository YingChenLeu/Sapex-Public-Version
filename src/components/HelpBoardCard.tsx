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

const urgencyVariant: Record<
  Problem["urgency"],
  "sage" | "community" | "danger"
> = {
  low: "sage",
  medium: "community",
  high: "danger",
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
      setMessageCount(snapshot.size);
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
      className="relative h-full"
    >
      <Card
        interactive
        className="flex h-full cursor-pointer flex-col overflow-hidden"
        onClick={() => onHelpClick(problem)}
      >
        <CardHeader className="pb-2">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-1">
              <Badge>{problem.course}</Badge>
              <span className="marginalia">{problem.category}</span>
            </div>
            <Badge variant={urgencyVariant[problem.urgency]}>
              {problem.urgency} urgency
            </Badge>
          </div>
          <CardTitle className="line-clamp-2 text-[15px] sm:text-base">
            {problem.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-grow overflow-hidden">
          <p className="custom-scrollbar max-h-24 overflow-y-auto pr-1 text-sm leading-relaxed text-chalk-2">
            {problem.description}
          </p>

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

        <CardFooter className="flex flex-col gap-4 border-t border-rule pt-4">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar className="h-7 w-7">
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
                  <AvatarFallback>
                    {problem.user?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm text-chalk">
                  {problem.user.name}
                </span>
                <span className="numeric text-[11px] text-chalk-3">
                  {problem.createdAt
                    ? formatDistanceToNow(problem.createdAt, { addSuffix: true })
                    : "Just now"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-chalk-3">
              <div className="flex items-center gap-1">
                <MessageCircle size={14} className="text-sage" />
                <span className="numeric font-medium text-chalk-2">
                  {messageCount}
                </span>
              </div>
              {problem.image ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageDialogOpen(true);
                  }}
                  className="group inline-flex items-center gap-2 rounded-control border border-rule bg-recess px-2 py-1 hover:border-rule-strong"
                  title="View attachment"
                >
                  <motion.span
                    className="inline-flex size-6 items-center justify-center rounded-control border border-rule bg-notice"
                    whileHover={{ rotate: -8, scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  >
                    <Paperclip size={13} className="text-chalk-2" />
                  </motion.span>
                  <span className="font-medium text-chalk-2 group-hover:text-chalk">
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
