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
    <nav className="border-b theme-border theme-bg-secondary/50 backdrop-blur-sm sticky top-0 z-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 relative flex items-center">
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 z-10 h-full px-2
                       bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/95 to-transparent
                       theme-text-muted hover:opacity-70 cursor-pointer flex items-center"
          >
            ◀
          </button>
        )}

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
                    ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]"
                    : "theme-text-muted hover:theme-text hover-bg-hover"
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 z-10 h-full px-2
                       bg-gradient-to-l from-[var(--bg-primary)] via-[var(--bg-primary)]/95 to-transparent
                       theme-text-muted hover:opacity-70 cursor-pointer flex items-center"
          >
            ▶
          </button>
        )}
      </div>
    </nav>
  );
}
