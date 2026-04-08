import { useState } from "react";
import { convertBase } from "../../utils/converters";
import CopyButton from "../common/CopyButton";

const bases = [
  { value: 10, label: "10진수 (Decimal)", prefix: "", placeholder: "255" },
  { value: 2, label: "2진수 (Binary)", prefix: "0b", placeholder: "11111111" },
  { value: 8, label: "8진수 (Octal)", prefix: "0o", placeholder: "377" },
  { value: 16, label: "16진수 (Hex)", prefix: "0x", placeholder: "FF" },
];

export default function BaseConverter() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState(10);

  const result = convertBase(input, fromBase);

  const resultRows = result
    ? [
        {
          label: "10진수 (Decimal)",
          value: String(result.decimal),
          copyValue: String(result.decimal),
        },
        {
          label: "2진수 (Binary)",
          value: result.binaryFormatted,
          copyValue: result.binary,
        },
        {
          label: "8진수 (Octal)",
          value: result.octalFormatted,
          copyValue: result.octal,
        },
        {
          label: "16진수 (Hex)",
          value: result.hexFormatted,
          copyValue: result.hex,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">🔢 진수 변환</h2>
        <p className="text-sm text-gray-500">
          숫자를 입력하면 2 / 8 / 10 / 16진수로 실시간 변환합니다.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        {/* 진수 선택 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">입력 진수</label>
          <div className="flex flex-wrap gap-2">
            {bases.map((b) => (
              <button
                key={b.value}
                onClick={() => {
                  setFromBase(b.value);
                  setInput("");
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${
                    fromBase === b.value
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                  }
                `}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* 입력 필드 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">값 입력</label>
          <div className="relative">
            {bases.find((b) => b.value === fromBase)?.prefix && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">
                {bases.find((b) => b.value === fromBase).prefix}
              </span>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={bases.find((b) => b.value === fromBase)?.placeholder}
              className={`
                w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                font-mono text-lg text-gray-100 placeholder-gray-600
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                transition-colors
                ${bases.find((b) => b.value === fromBase)?.prefix ? "pl-10" : ""}
              `}
            />
            {input && (
              <button
                onClick={() => setInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          {input && !result && (
            <p className="text-red-400 text-sm mt-2">
              유효하지 않은 {bases.find((b) => b.value === fromBase)?.label}{" "}
              값입니다.
            </p>
          )}
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
                <CopyButton value={row.copyValue} label={row.label} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 빠른 참조 */}
      {!input && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            💡 빠른 참조
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { dec: 0, bin: "0000", hex: "0" },
              { dec: 10, bin: "1010", hex: "A" },
              { dec: 15, bin: "1111", hex: "F" },
              { dec: 127, bin: "0111 1111", hex: "7F" },
              { dec: 128, bin: "1000 0000", hex: "80" },
              { dec: 255, bin: "1111 1111", hex: "FF" },
              { dec: 256, bin: "1 0000 0000", hex: "100" },
              { dec: 1024, bin: "100 0000 0000", hex: "400" },
            ].map((row) => (
              <button
                key={row.dec}
                onClick={() => {
                  setFromBase(10);
                  setInput(String(row.dec));
                }}
                className="bg-gray-800/50 rounded-lg p-2.5 text-left hover:bg-gray-800
                           transition-colors cursor-pointer group"
              >
                <span className="text-xs text-gray-500 group-hover:text-gray-400">
                  Dec
                </span>
                <span className="font-mono text-sm text-gray-200 block">
                  {row.dec}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
