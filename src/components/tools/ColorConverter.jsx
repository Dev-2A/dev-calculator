import { useState } from "react";
import { parseColor } from "../../utils/converters";

export default function ColorConverter() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(null);

  const result = parseColor(input);

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  const CopyBtn = ({ value, label }) => (
    <button
      onClick={() => handleCopy(value, label)}
      className="ml-3 px-3 py-1.5 text-xs rounded-md bg-gray-800 text-gray-400
                 hover:bg-gray-700 hover:text-gray-200 transition-all cursor-pointer shrink-0"
    >
      {copied === label ? "✓ 복사됨" : "복사"}
    </button>
  );

  const resultRows = result
    ? [
        { label: "HEX", value: result.hex, copyValue: result.hex },
        { label: "RGB", value: result.cssRgb, copyValue: result.cssRgb },
        { label: "HSL", value: result.cssHsl, copyValue: result.cssHsl },
        {
          label: "R, G, B",
          value: `${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b}`,
          copyValue: `${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b}`,
        },
        {
          label: "H, S, L",
          value: `${result.hsl.h}°, ${result.hsl.s}%, ${result.hsl.l}%`,
          copyValue: `${result.hsl.h}, ${result.hsl.s}, ${result.hsl.l}`,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">🎨 색상 코드 변환</h2>
        <p className="text-sm text-gray-500">
          HEX, RGB, HSL을 입력하면 나머지 형식으로 실시간 변환합니다.
        </p>
      </div>

      {/* 색상 프리뷰 + 입력 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        {/* 프리뷰 */}
        {result && (
          <div
            className="h-32 rounded-lg border border-gray-700 flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: result.hex }}
          >
            <span
              className="font-mono text-lg font-bold px-4 py-2 rounded-md backdrop-blur-sm"
              style={{
                color: result.isDark ? "#FFFFFF" : "#000000",
                backgroundColor: result.isDark
                  ? "rgba(0,0,0,0.2)"
                  : "rgba(255,255,255,0.2)",
              }}
            >
              {result.hex}
            </span>
          </div>
        )}

        {/* 입력 필드 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            색상 값 입력
          </label>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="#3B82F6  또는  59,130,246  또는  217,91,61"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                         font-mono text-lg text-gray-100 placeholder-gray-600
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {input && (
              <button
                onClick={() => setInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500
                           hover:text-gray-300 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          {input && !result && (
            <p className="text-red-400 text-sm mt-2">
              유효하지 않은 색상 값입니다. HEX (#FF0000), RGB (255,0,0), HSL
              (0,100,50)을 지원합니다.
            </p>
          )}
          <p className="text-xs text-gray-600 mt-2">
            지원 형식: #RRGGBB · #RGB · rgb(r,g,b) · r,g,b · hsl(h,s%,l%) ·
            h,s,l
          </p>
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400">변환 결과</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {resultRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs text-gray-500 block mb-0.5">
                    {row.label}
                  </span>
                  <span className="font-mono text-sm text-gray-100 break-all">
                    {row.value}
                  </span>
                </div>
                <CopyBtn value={row.copyValue} label={row.label} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RGB 슬라이더 */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-400">
            🎚️ RGB 슬라이더
          </h3>
          {[
            { channel: "R", value: result.rgb.r, color: "#EF4444" },
            { channel: "G", value: result.rgb.g, color: "#22C55E" },
            { channel: "B", value: result.rgb.b, color: "#3B82F6" },
          ].map(({ channel, value, color }) => (
            <div key={channel} className="flex items-center gap-4">
              <span className="text-sm font-mono w-4" style={{ color }}>
                {channel}
              </span>
              <div className="flex-1 relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(value / 255) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <span className="font-mono text-sm text-gray-300 w-8 text-right">
                {value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* HSL 시각화 */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-400">🌈 HSL 구성</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Hue",
                value: `${result.hsl.h}°`,
                sub: "색상",
                percent: (result.hsl.h / 360) * 100,
              },
              {
                label: "Saturation",
                value: `${result.hsl.s}%`,
                sub: "채도",
                percent: result.hsl.s,
              },
              {
                label: "Lightness",
                value: `${result.hsl.l}%`,
                sub: "명도",
                percent: result.hsl.l,
              },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="absolute h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="font-mono text-lg text-gray-200 font-bold block">
                  {item.value}
                </span>
                <span className="text-xs text-gray-500">
                  {item.sub} ({item.label})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 빠른 참조 */}
      {!input && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            💡 자주 쓰는 색상
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {[
              { hex: "#EF4444", name: "Red" },
              { hex: "#F97316", name: "Orange" },
              { hex: "#EAB308", name: "Yellow" },
              { hex: "#22C55E", name: "Green" },
              { hex: "#06B6D4", name: "Cyan" },
              { hex: "#3B82F6", name: "Blue" },
              { hex: "#8B5CF6", name: "Violet" },
              { hex: "#EC4899", name: "Pink" },
              { hex: "#FFFFFF", name: "White" },
              { hex: "#D1D5DB", name: "Gray-3" },
              { hex: "#6B7280", name: "Gray-5" },
              { hex: "#374151", name: "Gray-7" },
              { hex: "#1F2937", name: "Gray-8" },
              { hex: "#111827", name: "Gray-9" },
              { hex: "#000000", name: "Black" },
              { hex: "#7DD3FC", name: "Pastel B" },
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => setInput(c.hex)}
                className="group flex flex-col items-center gap-1 cursor-pointer"
              >
                <div
                  className="w-full aspect-square rounded-lg border border-gray-700
                             group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[10px] text-gray-500 group-hover:text-gray-400 truncate w-full text-center">
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
