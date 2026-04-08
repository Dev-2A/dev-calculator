import { useState, useEffect } from "react";
import { timestampToDate, dateToTimestamp } from "../../utils/converters";
import CopyButton from "../common/CopyButton";

export default function UnixTimestamp() {
  const [mode, setMode] = useState("toDate"); // 'toDate' | 'toTimestamp'
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [now, setNow] = useState(Date.now());

  // 실시간 현재 시각
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const tsResult = timestampToDate(tsInput);
  const dtResult = dateToTimestamp(dateInput);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">🕐 Unix 타임스탬프</h2>
        <p className="text-sm text-gray-500">
          타임스탬프 ↔ 날짜를 실시간 변환합니다.
        </p>
      </div>

      {/* 현재 시각 라이브 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-xs text-gray-500 block mb-1">
              현재 Unix 타임스탬프
            </span>
            <span className="font-mono text-2xl text-blue-400 font-bold">
              {Math.floor(now / 1000)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode("toDate");
                setTsInput(String(Math.floor(now / 1000)));
              }}
              className="px-3 py-2 text-xs rounded-lg bg-blue-600/20 text-blue-400
                         hover:bg-blue-600/30 transition-colors cursor-pointer"
            >
              초 단위 사용 →
            </button>
            <button
              onClick={() => {
                setMode("toDate");
                setTsInput(String(now));
              }}
              className="px-3 py-2 text-xs rounded-lg bg-blue-600/20 text-blue-400
                         hover:bg-blue-600/30 transition-colors cursor-pointer"
            >
              밀리초 단위 사용 →
            </button>
          </div>
        </div>
      </div>

      {/* 모드 전환 */}
      <div className="flex gap-2">
        {[
          { id: "toDate", label: "타임스탬프 → 날짜" },
          { id: "toTimestamp", label: "날짜 → 타임스탬프" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`
              flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${
                mode === m.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }
            `}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 타임스탬프 → 날짜 */}
      {mode === "toDate" && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <label className="block text-sm text-gray-400 mb-2">
              Unix 타임스탬프 입력
            </label>
            <div className="relative">
              <input
                type="text"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                placeholder="1700000000 또는 1700000000000"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                           font-mono text-lg text-gray-100 placeholder-gray-600
                           focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {tsInput && (
                <button
                  onClick={() => setTsInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500
                             hover:text-gray-300 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
            {tsInput && !tsResult && (
              <p className="text-red-400 text-sm mt-2">
                유효하지 않은 타임스탬프입니다.
              </p>
            )}
            {tsResult && (
              <p className="text-gray-500 text-xs mt-2">
                감지: {tsResult.unit === "ms" ? "밀리초(ms)" : "초(s)"} 단위
              </p>
            )}
          </div>

          {tsResult && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400">
                  변환 결과
                </h3>
              </div>
              <div className="divide-y divide-gray-800">
                {[
                  { label: "한국 시간 (KST)", value: tsResult.local },
                  { label: "ISO 8601", value: tsResult.iso },
                  { label: "UTC", value: tsResult.utc },
                  { label: "상대 시간", value: tsResult.relative },
                  {
                    label: "타임스탬프 (초)",
                    value: String(tsResult.timestampSec),
                  },
                  {
                    label: "타임스탬프 (밀리초)",
                    value: String(tsResult.timestampMs),
                  },
                ].map((row) => (
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
                    <CopyButton value={row.copyValue} label={row.label} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 날짜 분해 */}
          {tsResult && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                📅 날짜 분해
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
                {[
                  { label: "년", value: tsResult.breakdown.year },
                  {
                    label: "월",
                    value: String(tsResult.breakdown.month).padStart(2, "0"),
                  },
                  {
                    label: "일",
                    value: String(tsResult.breakdown.day).padStart(2, "0"),
                  },
                  {
                    label: "요일",
                    value: `${tsResult.breakdown.dayOfWeek}요일`,
                  },
                  {
                    label: "시",
                    value: String(tsResult.breakdown.hour).padStart(2, "0"),
                  },
                  {
                    label: "분",
                    value: String(tsResult.breakdown.minute).padStart(2, "0"),
                  },
                  {
                    label: "초",
                    value: String(tsResult.breakdown.second).padStart(2, "0"),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gray-800/50 rounded-lg p-3 text-center"
                  >
                    <span className="text-xs text-gray-500 block mb-1">
                      {item.label}
                    </span>
                    <span className="font-mono text-sm text-gray-200 font-semibold">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 날짜 → 타임스탬프 */}
      {mode === "toTimestamp" && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <label className="block text-sm text-gray-400 mb-2">
              날짜/시간 입력
            </label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              step="1"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                         font-mono text-lg text-gray-100
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                         [color-scheme:dark]"
            />
            <button
              onClick={() => {
                const now = new Date();
                const local = new Date(
                  now.getTime() - now.getTimezoneOffset() * 60000,
                );
                setDateInput(local.toISOString().slice(0, 19));
              }}
              className="mt-3 px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-400
                         hover:bg-gray-700 hover:text-gray-200 transition-colors cursor-pointer"
            >
              현재 시각으로 설정
            </button>
          </div>

          {dtResult && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400">
                  변환 결과
                </h3>
              </div>
              <div className="divide-y divide-gray-800">
                {[
                  {
                    label: "Unix 타임스탬프 (초)",
                    value: String(dtResult.timestampSec),
                  },
                  {
                    label: "Unix 타임스탬프 (밀리초)",
                    value: String(dtResult.timestampMs),
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-gray-500 block mb-0.5">
                        {row.label}
                      </span>
                      <span className="font-mono text-2xl text-blue-400 font-bold">
                        {row.value}
                      </span>
                    </div>
                    <CopyButton value={row.copyValue} label={row.label} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 빠른 참조 */}
      {mode === "toDate" && !tsInput && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            💡 유명한 타임스탬프
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Unix Epoch", ts: "0", desc: "1970-01-01 00:00:00 UTC" },
              {
                label: "Y2K",
                ts: "946684800",
                desc: "2000-01-01 00:00:00 UTC",
              },
              {
                label: "32-bit Overflow",
                ts: "2147483647",
                desc: "2038-01-19 03:14:07 UTC",
              },
              {
                label: "1 Billion",
                ts: "1000000000",
                desc: "2001-09-09 01:46:40 UTC",
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setTsInput(item.ts)}
                className="bg-gray-800/50 rounded-lg p-3 text-left hover:bg-gray-800
                           transition-colors cursor-pointer group"
              >
                <span className="text-xs text-gray-500 group-hover:text-gray-400">
                  {item.label}
                </span>
                <span className="font-mono text-sm text-gray-200 block">
                  {item.ts}
                </span>
                <span className="text-xs text-gray-600">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
