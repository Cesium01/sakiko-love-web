"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./components/themeToggle";
import ImageModal from "./components/imageModal";

const REGIONS = ["全部", "东北", "华北", "华东", "华南", "华中", "西南", "西北"];

export interface Photo {
  src: string;
  region: string;
  alt: string;
  isVideo: boolean;
}

export default function Home() {
  const [activeRegion, setActiveRegion] = useState("全部");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const filteredPhotos = useMemo(() => photos.filter(
    (photo) => activeRegion === "全部" || photo.region === activeRegion
  ), [activeRegion, photos]);

  useEffect(() => {
    fetch('/api/images')
      .then(res => res.json())
      .then(json => setPhotos(json.filter((photo: Photo) => !photo.isVideo)));
  }, []);

  return (
    <div className="min-h-screen text-gray-900 p-8">
      {/* 标题区域 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">🎂 丰川祥子庆生粉丝返图合集</h1>
        <p className="text-gray-500">感谢世界各地粉丝的爱意！</p>
      </div>
      <ThemeToggle />

      {/* 3. 地域筛选器 (Filter Tabs) */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {REGIONS.map((region) => (
          <button
            key={region}
            onClick={() => setActiveRegion(region)}
            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeRegion === region ? "text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
          >
            {activeRegion === region && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-blue-500 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {region}
          </button>
        ))}
      </div>

      {/* 4. 照片展示网格 */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.src}
              layout // 允许元素在过滤时平滑改变位置
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="group relative aspect-4/5 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Next.js Image 自带 lazy loading 懒加载 */}
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* 悬浮遮罩与信息 */}
              <div
                className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6"
              >
                <span className="text-white text-xs font-bold uppercase tracking-wider mb-1">
                  📍 {photo.region}
                </span>
                <h3 className="text-white text-lg font-medium">{photo.alt}</h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 空状态处理 */}
      {filteredPhotos.length === 0 && (
        <div className="text-center mt-20 text-shadow-lg text-white/90">
          <p>该地区暂无返图，期待你的投稿！</p>
        </div>
      )}

      {/* 大图 Modal */}
      <ImageModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
}
