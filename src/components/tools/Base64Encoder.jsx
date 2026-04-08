import { useState } from "react";
import { encodeBase64, decodeBase64 } from "../../utils/converters";

export default function Base64Encoder() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [copied, setCopied] = useState(null);

  const encodeResult = mode === "encode" ? encodeBase64(input, urlSafe) : null;
  const decodeResult = mode === "decode" ? decodeBase64(input) : null;

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
                 hover:bg-gray-700 hover:text-gray-200 transition-all cursor-pointer flex-shrink-0"
    >
      {copied === label ? "✓ 복사됨" : "복사"}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">📦 Base64 인코더/디코더</h2>
        <p className="text-sm text-gray-500">
          텍스트를 Base64로 인코딩하거나 Base64 문자열을 디코딩합니다.
        </p>
      </div>

      {/* 모드 전환 */}
      <div className="flex gap-2">
        {[
          { id: "encode", label: "인코딩 (텍스트 → Base64)" },
          { id: "decode", label: "디코딩 (Base64 → 텍스트)" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id);
              setInput("");
            }}
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

      {/* 입력 영역 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        {mode === "encode" && (
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400">옵션</label>
            <button
              onClick={() => setUrlSafe(!urlSafe)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
                transition-all cursor-pointer
                ${
                  urlSafe
                    ? "bg-blue-600/15 border border-blue-500/30 text-blue-400"
                    : "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700"
                }
              `}
            >
              <span
                className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-colors
                ${urlSafe ? "border-blue-400 bg-blue-500" : "border-gray-500"}`}
              >
                {urlSafe && <span className="text-white text-[8px]">✓</span>}
              </span>
              URL-safe 모드
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            {mode === "encode" ? "인코딩할 텍스트" : "Base64 문자열"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Hello, 안녕하세요! 🎉"
                : "SGVsbG8sIOyViOuFle2VmOyEuOyalCEg8J-OiQ=="
            }
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                       font-mono text-sm text-gray-100 placeholder-gray-600 resize-none
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {mode === "encode" && urlSafe && (
          <p className="text-xs text-gray-600">
            URL-safe: <code className="text-gray-400">+</code> →{" "}
            <code className="text-blue-400">-</code>,{" "}
            <code className="text-gray-400">/</code> →{" "}
            <code className="text-blue-400">_</code>, 패딩(
            <code className="text-gray-400">=</code>) 제거
          </p>
        )}
      </div>

      {/* ─── 인코딩 결과 ─── */}
      {mode === "encode" && encodeResult && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400">
                인코딩 결과
              </h3>
              <CopyBtn value={encodeResult.encoded} label="encoded" />
            </div>
            <div className="px-5 py-4">
              <p className="font-mono text-sm text-green-400 break-all select-all">
                {encodeResult.encoded}
              </p>
            </div>
          </div>

          {/* Data URI */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400">
                Data URI (text/plain)
              </h3>
              <CopyBtn
                value={`data:text/plain;base64,${encodeResult.encoded}`}
                label="datauri"
              />
            </div>
            <div className="px-5 py-4">
              <p className="font-mono text-xs text-gray-400 break-all">
                <span className="text-gray-500">data:text/plain;base64,</span>
                <span className="text-green-400">{encodeResult.encoded}</span>
              </p>
            </div>
          </div>

          {/* 통계 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  원본 크기
                </span>
                <span className="font-mono text-lg text-gray-200">
                  {encodeResult.originalSize} B
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  인코딩 크기
                </span>
                <span className="font-mono text-lg text-gray-200">
                  {encodeResult.encodedSize} B
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">비율</span>
                <span className="font-mono text-lg text-yellow-400">
                  {encodeResult.ratio}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {mode === "encode" && input && !encodeResult && (
        <p className="text-red-400 text-sm">인코딩에 실패했습니다.</p>
      )}

      {/* ─── 디코딩 결과 ─── */}
      {mode === "decode" && decodeResult && (
        <div className="space-y-4">
          {/* 텍스트 결과 */}
          {decodeResult.isText && decodeResult.text && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-400">
                    디코딩 결과
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">
                    텍스트
                  </span>
                </div>
                <CopyBtn value={decodeResult.text} label="decoded" />
              </div>
              <div className="px-5 py-4">
                <p className="font-mono text-sm text-green-400 break-all whitespace-pre-wrap">
                  {decodeResult.text}
                </p>
              </div>
            </div>
          )}

          {/* 이미지 프리뷰 */}
          {decodeResult.imageType && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-400">
                    이미지 감지됨
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400">
                    {decodeResult.imageType.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="p-5 flex justify-center">
                <img
                  src={decodeResult.dataUri}
                  alt="Decoded"
                  className="max-w-full max-h-64 rounded-lg border border-gray-700"
                />
              </div>
            </div>
          )}

          {/* 바이너리가 텍스트가 아닌 경우 */}
          {!decodeResult.isText && !decodeResult.imageType && (
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">⚠️</span>
                <h3 className="text-sm font-semibold text-yellow-400">
                  바이너리 데이터
                </h3>
              </div>
              <p className="text-sm text-gray-400">
                유효한 UTF-8 텍스트가 아닙니다. 아래 Hex Dump로 내용을
                확인해보세요.
              </p>
            </div>
          )}

          {/* Hex Dump */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400">
                🔍 Hex Dump ({decodeResult.hexDump.totalBytes} bytes)
                {decodeResult.hexDump.truncated && (
                  <span className="text-xs text-gray-600 ml-2">
                    처음 64바이트만 표시
                  </span>
                )}
              </h3>
            </div>
            <div className="px-5 py-4 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] text-gray-600">
                    <th className="text-left pr-4 pb-2 font-normal">Offset</th>
                    <th className="text-left pr-4 pb-2 font-normal">Hex</th>
                    <th className="text-left pb-2 font-normal">ASCII</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {decodeResult.hexDump.lines.map((line) => (
                    <tr key={line.offset} className="hover:bg-gray-800/50">
                      <td className="text-gray-600 pr-4 py-0.5">
                        {line.offset}
                      </td>
                      <td className="text-gray-300 pr-4 py-0.5 whitespace-pre">
                        {line.hex}
                      </td>
                      <td className="text-cyan-400 py-0.5">{line.ascii}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 통계 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  입력 길이
                </span>
                <span className="font-mono text-lg text-gray-200">
                  {input.trim().length} chars
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  디코딩 크기
                </span>
                <span className="font-mono text-lg text-gray-200">
                  {decodeResult.decodedSize} bytes
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {mode === "decode" && input && !decodeResult && (
        <p className="text-red-400 text-sm">
          디코딩에 실패했습니다. 유효한 Base64 문자열인지 확인해주세요.
        </p>
      )}

      {/* 빠른 참조 */}
      {!input && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            💡 Base64 알아두기
          </h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <span className="text-xs text-gray-500 block mb-1">
                문자셋 (Standard)
              </span>
              <span className="font-mono text-xs text-gray-300">
                A-Z a-z 0-9 + / =
              </span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <span className="text-xs text-gray-500 block mb-1">
                문자셋 (URL-safe)
              </span>
              <span className="font-mono text-xs text-gray-300">
                A-Z a-z 0-9 <span className="text-blue-400">-</span>{" "}
                <span className="text-blue-400">_</span> (패딩 없음)
              </span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <span className="text-xs text-gray-500 block mb-1">
                크기 변화
              </span>
              <span className="text-xs text-gray-300">
                인코딩 시 원본 대비 약{" "}
                <span className="text-yellow-400 font-mono">133%</span>로 증가
                (3바이트 → 4문자)
              </span>
            </div>
          </div>

          {/* 예제 */}
          <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setMode("encode");
                setInput("Hello, 안녕하세요! 🎉");
              }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              📝 한글+이모지 인코딩 테스트 →
            </button>
            <button
              onClick={() => {
                setMode("decode");
                setInput("SGVsbG8sIOyViOuFle2VmOyEuOyalCEg8J+OiQ==");
              }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              📝 디코딩 테스트 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
