import { useRef, useState, useEffect } from "react";

export default function TabNav({ tabs, activeTab, onTabChange }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  // 활성 탭이 바뀌면 해당 탭이 보이도록 스크롤
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector(`[data-tab-id="${activeTab}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({
        inline: "nearest",
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 relative flex items-center">
        {/* 왼쪽 화살표 */}
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 z-10 h-full px-2 bg-gradient-to-r from-gray-900 via-gray-900/95 to-transparent
                       text-gray-400 hover:text-gray-200 cursor-pointer flex items-center"
          >
            ◀
          </button>
        )}

        {/* 탭 목록 */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-1 overflow-x-auto scrollbar-hide py-2 w-full"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                whitespace-nowrap transition-all duration-200 cursor-pointer
                ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 오른쪽 화살표 */}
        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 z-10 h-full px-2 bg-gradient-to-l from-gray-900 via-gray-900/95 to-transparent
                       text-gray-400 hover:text-gray-200 cursor-pointer flex items-center"
          >
            ▶
          </button>
        )}
      </div>
    </nav>
  );
}
