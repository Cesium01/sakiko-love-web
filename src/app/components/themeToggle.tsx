'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react'; // 或你自己的图标

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function useIsClient() {
    return useSyncExternalStore(
      () => () => { },           // subscribe（空）
      () => true,               // getSnapshot client → true
      () => false               // getServerSnapshot → false
    );
  }

  // 使用
  const isClient = useIsClient();

  if (!isClient) {
    return null; // 或显示骨架占位
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="
      fixed top-4 right-4 z-30 shadow-lg duration-200
      p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
      aria-label="切换主题"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}