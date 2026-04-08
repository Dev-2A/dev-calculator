export default function TabNav({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
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
      </div>
    </nav>
  );
}
