"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // 当页面向下滚动超过 300px 时，显示按钮
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // 监听滚动事件
        window.addEventListener("scroll", toggleVisibility);

        // 清理副作用，防止内存泄漏
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // 启用平滑滚动
        });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="返回顶部"
            className={`
        fixed bottom-8 right-8 z-30 
        p-3 rounded-full 
        bg-white/80 text-gray-800 shadow-lg backdrop-blur-md
        border border-gray-200/50
        transition-all duration-300 ease-in-out hover:scale-110 hover:bg-white
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
      `}
        >
            {/* 向上箭头的 SVG 图标 */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 15.75l7.5-7.5 7.5 7.5"
                />
            </svg>
        </button>
    );
}