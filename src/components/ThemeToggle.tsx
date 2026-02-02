/**
 * 다크모드 토글 컴포넌트
 * - light / dark / system 세 가지 모드 지원
 * - 드롭다운으로 선택
 */
import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("system");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("theme") as Theme | null;
        if (saved && ["light", "dark", "system"].includes(saved)) {
            setTheme(saved);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (theme === "dark" || (theme === "system" && systemDark)) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme, mounted]);

    // 시스템 테마 변경 감지
    useEffect(() => {
        if (!mounted || theme !== "system") return;

        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            if (media.matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };

        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
    }, [theme, mounted]);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse" />
        );
    }

    return (
        <div className="relative group">
            <button
                type="button"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="테마 전환"
                aria-expanded={undefined}
                onClick={() => {
                    const next: Theme =
                        theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
                    setTheme(next);
                }}
            >
                {theme === "light" && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                )}
                {theme === "dark" && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                )}
                {theme === "system" && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                )}
            </button>

            {/* 토글 시 툴팁 표시 */}
            <span className="absolute right-0 bottom-full mb-1 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {theme === "light" && "라이트"}
                {theme === "dark" && "다크"}
                {theme === "system" && "시스템"}
            </span>
        </div>
    );
}
