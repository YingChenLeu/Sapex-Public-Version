"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExternalLink, Download } from "lucide-react";

interface DisplayImageProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const DisplayImage = ({ isOpen, onClose, imageUrl }: DisplayImageProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] max-w-5xl border border-white/10 bg-[#0C111C] p-0 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">Attachment</div>
            <div className="text-xs text-[#D8DEDE]/60 truncate">
              Preview — open or download
            </div>
          </div>
          <div className="flex items-center gap-2 pr-8">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#D8DEDE]/85 hover:text-white hover:border-[#A8D3CC]/30 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open
            </a>
            <a
              href={imageUrl}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#D8DEDE]/85 hover:text-white hover:border-[#A8D3CC]/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
        </div>

        <div className="relative bg-black/40">
          <div className="max-h-[78vh] w-full flex items-center justify-center p-4">
            <img
              src={imageUrl}
              alt="Attachment"
              className="max-h-[72vh] w-auto max-w-full rounded-xl border border-white/10 shadow-2xl object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
