import { useState } from "react";
import { convertBytes, byteUnits, siUnits } from "../../utils/converters";

export default function ByteConverter() {
  const [input, setInput] = useState("");
  const [fromUnit, setFromUnit] = useState("mb");
  const [useSI, setUseSI] = useState(false);
  const [copied, setCopied] = useState(null);

  const units = useSI ? siUnits : byteUnits;
  const results = convertBytes(input, fromUnit, useSI);

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">💾 바이트 단위 변환</h2>
        <p className="text-sm text-gray-500">
          B, KB, MB, GB, TB, PB 사이를 실시간 변환합니다.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        {/* SI / Binary 토글 */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">기준 단위</label>
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setUseSI(false)}
              className={`
                px-3 py-1.5 text-xs rounded-md font-medium transition-all cursor-pointer
                ${
                  !useSI
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }
              `}
            >
              Binary (1024)
            </button>
            <button
              onClick={() => setUseSI(true)}
              className={`
                px-3 py-1.5 text-xs rounded-md font-medium transition-all cursor-pointer
                ${
                  useSI
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }
              `}
            >
              SI (1000)
            </button>
          </div>
        </div>

        {/* 단위 선택 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">입력 단위</label>
          <div className="flex flex-wrap gap-2">
            {units.map((u) => (
              <button
                key={u.key}
                onClick={() => setFromUnit(u.key)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${
                    fromUnit === u.key
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                  }
                `}
              >
                {u.key.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 값 입력 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">값 입력</label>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="1024"
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
          {input && !results && (
            <p className="text-red-400 text-sm mt-2">
              유효하지 않은 숫자입니다. (음수 불가)
            </p>
          )}
        </div>
      </div>

      {/* 결과 영역 */}
      {results && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-400">변환 결과</h3>
            <span className="text-xs text-gray-600">
              {useSI ? "1 KB = 1,000 B" : "1 KB = 1,024 B"}
            </span>
          </div>
          <div className="divide-y divide-gray-800">
            {results.map((row) => {
              const isSource = row.key === fromUnit;
              return (
                <div
                  key={row.key}
                  className={`
                    flex items-center justify-between px-5 py-3 transition-colors
                    ${isSource ? "bg-blue-600/5 border-l-2 border-blue-500" : "hover:bg-gray-800/50"}
                  `}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-xs text-gray-500 block mb-0.5">
                      {row.label}
                    </span>
                    <span
                      className={`font-mono text-sm break-all ${isSource ? "text-blue-400 font-bold" : "text-gray-100"}`}
                    >
                      {row.formatted}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(String(row.value), row.key)}
                    className="ml-3 px-3 py-1.5 text-xs rounded-md bg-gray-800 text-gray-400
                               hover:bg-gray-700 hover:text-gray-200 transition-all cursor-pointer
                               shrink-0"
                  >
                    {copied === row.key ? "✓ 복사됨" : "복사"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bytes 원본값 */}
      {results && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">
            📊 원시 바이트
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-mono text-lg text-gray-200">
              {results[0].bytes.toLocaleString()} bytes
            </span>
            <button
              onClick={() => handleCopy(String(results[0].bytes), "raw")}
              className="px-3 py-1.5 text-xs rounded-md bg-gray-800 text-gray-400
                         hover:bg-gray-700 hover:text-gray-200 transition-all cursor-pointer"
            >
              {copied === "raw" ? "✓ 복사됨" : "복사"}
            </button>
          </div>
        </div>
      )}

      {/* 빠른 참조 */}
      {!input && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            💡 자주 쓰는 용량
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "CD-ROM", value: "700", unit: "mb" },
              { label: "DVD", value: "4.7", unit: "gb" },
              { label: "USB (16GB)", value: "16", unit: "gb" },
              { label: "Blu-ray", value: "25", unit: "gb" },
              { label: "SSD (256GB)", value: "256", unit: "gb" },
              { label: "SSD (1TB)", value: "1", unit: "tb" },
              { label: "AWS S3 Free", value: "5", unit: "gb" },
              { label: "GitHub LFS", value: "2", unit: "gb" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setFromUnit(item.unit);
                  setInput(item.value);
                }}
                className="bg-gray-800/50 rounded-lg p-3 text-left hover:bg-gray-800
                           transition-colors cursor-pointer group"
              >
                <span className="text-xs text-gray-500 group-hover:text-gray-400">
                  {item.label}
                </span>
                <span className="font-mono text-sm text-gray-200 block">
                  {item.value} {item.unit.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
