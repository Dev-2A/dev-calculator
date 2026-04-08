import { useState } from "react";
import { encodeUrl, decodeUrl, parseUrlParts } from "../../utils/converters";

const modes = [
  { id: "encode", label: "인코딩" },
  { id: "decode", label: "디코딩" },
  { id: "parse", label: "URL 분석" },
];

export default function UrlEncoder() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("");
  const [encodeMode, setEncodeMode] = useState("component");
  const [copied, setCopied] = useState(null);

  const encodeResult = mode === "encode" ? encodeUrl(input, encodeMode) : null;
  const decodeResult = mode === "decode" ? decodeUrl(input) : null;
  const parseResult = mode === "parse" ? parseUrlParts(input) : null;

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
        <h2 className="text-xl font-bold mb-1">🔗 URL 인코더/디코더</h2>
        <p className="text-sm text-gray-500">
          URL을 인코딩/디코딩하거나 구조를 분석합니다.
        </p>
      </div>

      {/* 모드 전환 */}
      <div className="flex gap-2">
        {modes.map((m) => (
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
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              인코딩 방식
            </label>
            <div className="flex gap-2">
              {[
                {
                  id: "component",
                  label: "encodeURIComponent",
                  desc: "파라미터 값",
                },
                { id: "uri", label: "encodeURI", desc: "전체 URL" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setEncodeMode(opt.id)}
                  className={`
                    flex-1 px-3 py-2 rounded-lg text-left transition-all cursor-pointer
                    ${
                      encodeMode === opt.id
                        ? "bg-blue-600/15 border border-blue-500/30 text-blue-400"
                        : "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700"
                    }
                  `}
                >
                  <span className="font-mono text-xs block">{opt.label}</span>
                  <span className="text-[10px] text-gray-500">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            {mode === "encode"
              ? "인코딩할 문자열"
              : mode === "decode"
                ? "디코딩할 문자열"
                : "URL 입력"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "안녕하세요 Hello World! @#$%"
                : mode === "decode"
                  ? "%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94"
                  : "https://example.com/search?q=hello&lang=ko#results"
            }
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                       font-mono text-sm text-gray-100 placeholder-gray-600 resize-none
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
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
              <p className="font-mono text-sm text-green-400 break-all">
                {encodeResult.encoded}
              </p>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  원본 길이
                </span>
                <span className="font-mono text-lg text-gray-200">
                  {encodeResult.charCount}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  인코딩 길이
                </span>
                <span className="font-mono text-lg text-gray-200">
                  {encodeResult.encodedCharCount}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">증가량</span>
                <span
                  className={`font-mono text-lg ${encodeResult.sizeDiff > 0 ? "text-yellow-400" : "text-gray-200"}`}
                >
                  {encodeResult.sizeDiff > 0 ? "+" : ""}
                  {encodeResult.sizeDiff}
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
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400">
                디코딩 결과
              </h3>
              <CopyBtn value={decodeResult.decoded} label="decoded" />
            </div>
            <div className="px-5 py-4">
              <p className="font-mono text-sm text-green-400 break-all">
                {decodeResult.decoded}
              </p>
            </div>
          </div>

          {decodeResult.doubleDecoded && (
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-yellow-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-xs">⚠️</span>
                  <h3 className="text-sm font-semibold text-yellow-400">
                    이중 인코딩 감지
                  </h3>
                </div>
                <CopyBtn value={decodeResult.doubleDecoded} label="double" />
              </div>
              <div className="px-5 py-4">
                <p className="font-mono text-sm text-yellow-300 break-all">
                  {decodeResult.doubleDecoded}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  입력 길이
                </span>
                <span className="font-mono text-lg text-gray-200">
                  {decodeResult.charCount}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  디코딩 길이
                </span>
                <span className="font-mono text-lg text-gray-200">
                  {decodeResult.decodedCharCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {mode === "decode" && input && !decodeResult && (
        <p className="text-red-400 text-sm">
          디코딩에 실패했습니다. 유효한 URL 인코딩 문자열인지 확인해주세요.
        </p>
      )}

      {/* ─── URL 분석 결과 ─── */}
      {mode === "parse" && parseResult && (
        <div className="space-y-4">
          {/* URL 구성 요소 */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400">
                🧩 URL 구성 요소
              </h3>
            </div>
            <div className="divide-y divide-gray-800">
              {[
                { label: "Protocol", value: parseResult.protocol },
                { label: "Host", value: parseResult.host },
                parseResult.port && { label: "Port", value: parseResult.port },
                { label: "Path", value: parseResult.pathname },
                parseResult.search && {
                  label: "Query",
                  value: parseResult.search,
                },
                parseResult.hash && { label: "Hash", value: parseResult.hash },
                { label: "Origin", value: parseResult.origin },
              ]
                .filter(Boolean)
                .map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-gray-500 block mb-0.5">
                        {row.label}
                      </span>
                      <span className="font-mono text-sm text-gray-100 break-all">
                        {row.value}
                      </span>
                    </div>
                    <CopyBtn value={row.value} label={row.label} />
                  </div>
                ))}
            </div>
          </div>

          {/* 쿼리 파라미터 */}
          {parseResult.params.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400">
                  📋 쿼리 파라미터 ({parseResult.params.length}개)
                </h3>
              </div>
              <div className="divide-y divide-gray-800">
                {parseResult.params.map((param, i) => (
                  <div
                    key={`${param.key}-${i}`}
                    className="px-5 py-3 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                        {param.keyDecoded}
                      </span>
                      <span className="font-mono text-sm text-gray-100 break-all">
                        {param.valueDecoded}
                      </span>
                    </div>
                    {param.value !== param.valueDecoded && (
                      <span className="text-[10px] text-gray-600 font-mono">
                        raw: {param.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {mode === "parse" && input && !parseResult && (
        <p className="text-red-400 text-sm">URL을 파싱할 수 없습니다.</p>
      )}

      {/* 빠른 참조 */}
      {!input && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            💡 자주 인코딩되는 문자
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { char: "공백", encoded: "%20 / +" },
              { char: "!", encoded: "%21" },
              { char: "#", encoded: "%23" },
              { char: "$", encoded: "%24" },
              { char: "&", encoded: "%26" },
              { char: "+", encoded: "%2B" },
              { char: "/", encoded: "%2F" },
              { char: ":", encoded: "%3A" },
              { char: "=", encoded: "%3D" },
              { char: "?", encoded: "%3F" },
              { char: "@", encoded: "%40" },
              { char: "한", encoded: "%ED%95%9C" },
            ].map((item) => (
              <div
                key={item.char}
                className="bg-gray-800/50 rounded-lg p-2.5 text-center"
              >
                <span className="font-mono text-sm text-gray-200 block">
                  {item.char}
                </span>
                <span className="font-mono text-[10px] text-gray-500">
                  {item.encoded}
                </span>
              </div>
            ))}
          </div>

          {/* 예제 */}
          <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-2">
            {[
              {
                label: "한글 포함 URL",
                value: "https://example.com/검색?q=안녕하세요&page=1",
              },
              {
                label: "인코딩된 URL",
                value:
                  "https://example.com/%EA%B2%80%EC%83%89?q=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94&page=1",
              },
            ].map((ex) => (
              <button
                key={ex.label}
                onClick={() => {
                  if (ex.label.includes("인코딩된")) setMode("decode");
                  else setMode("encode");
                  setInput(ex.value);
                }}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                📝 {ex.label} 테스트 →
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
