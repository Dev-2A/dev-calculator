import { useState } from "react";
import TabNav from "./TabNav";
import { tabs } from "../../utils/tabConfig";

export default function Layout() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* 헤더 */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧮</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Dev Calculator
              </h1>
              <p className="text-xs text-gray-500">개발자 전용 만능 계산기</p>
            </div>
          </div>
          <a
            href="https://github.com/Dev-2A/dev-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 메인 컨텐츠 */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {ActiveComponent && <ActiveComponent />}
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        Made with 🥤 and 💙 by Dev-2A
      </footer>
    </div>
  );
}
