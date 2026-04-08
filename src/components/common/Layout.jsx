import { useState } from "react";
import TabNav from "./TabNav";
import { tabs } from "../../utils/tabConfig";
import { useTheme } from "../../hooks/useTheme";

export default function Layout() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const { theme, toggle } = useTheme();

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component;

  return (
    <div className="min-h-screen theme-bg-primary theme-text transition-colors duration-300">
      {/* 헤더 */}
      <header className="theme-bg-secondary border-b theme-border transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧮</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Dev Calculator
              </h1>
              <p className="text-xs theme-text-muted">
                개발자 전용 만능 계산기
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* 테마 토글 */}
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg theme-bg-card theme-border border flex items-center justify-center
                         hover:opacity-80 transition-all cursor-pointer"
              title={
                theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"
              }
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <a
              href="https://github.com/Dev-2A/dev-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="theme-text-muted hover:opacity-70 transition-colors text-sm"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 메인 컨텐츠 */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {ActiveComponent && <ActiveComponent />}
      </main>

      {/* 푸터 */}
      <footer className="border-t theme-border py-4 text-center text-xs theme-text-faint transition-colors duration-300">
        Made with 🥤 and ❤️ by Dev-2A
      </footer>
    </div>
  );
}
