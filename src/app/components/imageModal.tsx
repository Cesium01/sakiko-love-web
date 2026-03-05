"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { Photo } from "@/app/page";
import { X } from "lucide-react";

interface ImageModalProps {
  photo: Photo | null;
  onClose: () => void;
}

export default function ImageModal({ photo, onClose }: ImageModalProps) {
  // 按 Esc 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 md:p-8"
        onClick={onClose}           // 点击背景关闭
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative h-full w-full max-w-6xl max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()} // 阻止图片区域点击冒泡关闭
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors text-2xl font-bold shadow-md"
            aria-label="关闭大图"
          >
            <X className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* 图片容器 */}
          <div className="relative w-full h-full aspect-4/5 sm:aspect-3/4 md:aspect-auto">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              unoptimized
              priority
              className="object-contain"
              sizes="(max-width: 768px) 95vw, (max-width: 1200px) 85vw, 1200px"
            />
          </div>

          {/* 底部信息栏（可选，根据需要保留或删除） */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent px-6 pb-6 pt-12 pointer-events-none">
            <div className="text-white">
              <p className="text-sm opacity-80 mb-1">
                📍 {photo.region}
              </p>
              <h3 className="text-xl md:text-2xl font-medium">
                {photo.alt}
              </h3>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}