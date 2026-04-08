import { useState } from "react";
import { decodeJwt } from "../../utils/converters";

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(null);

  const result = decodeJwt(input);

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
      className="px-3 py-1.5 text-xs rounded-md bg-gray-800 text-gray-400
                 hover:bg-gray-700 hover:text-gray-200 transition-all cursor-pointer flex-shrink-0"
    >
      {copied === label ? "✓ 복사됨" : "복사"}
    </button>
  );

  // 토큰 색상 분리 미리보기
  const tokenParts = input.trim().split(".");
  const isValidStructure = tokenParts.length === 3;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">🔑 JWT 디코더</h2>
        <p className="text-sm text-gray-500">
          JWT 토큰을 붙여넣으면 Header와 Payload를 실시간 디코딩합니다.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">JWT 토큰 입력</label>
          {result && (
            <span
              className={`
                text-xs px-2.5 py-1 rounded-full font-medium
                ${
                  result.isExpired === true
                    ? "bg-red-500/15 text-red-400"
                    : result.isExpired === false
                      ? "bg-green-500/15 text-green-400"
                      : "bg-gray-700 text-gray-400"
                }
              `}
            >
              {result.isExpired === true
                ? "⛔ 만료됨"
                : result.isExpired === false
                  ? "✅ 유효"
                  : "⏱ exp 없음"}
            </span>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                     font-mono text-sm text-gray-100 placeholder-gray-600 resize-none
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {input && !result && (
          <p className="text-red-400 text-sm">
            유효하지 않은 JWT 형식입니다. xxxxx.yyyyy.zzzzz 구조여야 합니다.
          </p>
        )}
      </div>

      {/* 토큰 구조 미리보기 */}
      {isValidStructure && input.trim() && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            🧩 토큰 구조
          </h3>
          <div className="font-mono text-xs break-all leading-relaxed">
            <span className="text-red-400">{tokenParts[0]}</span>
            <span className="text-gray-600">.</span>
            <span className="text-violet-400">{tokenParts[1]}</span>
            <span className="text-gray-600">.</span>
            <span className="text-cyan-400">{tokenParts[2]}</span>
          </div>
          <div className="flex gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Header
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />{" "}
              Payload
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />{" "}
              Signature
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <h3 className="text-sm font-semibold text-gray-400">Header</h3>
            </div>
            <CopyBtn value={result.headerJson} label="header" />
          </div>
          <pre className="px-5 py-4 font-mono text-sm text-red-300 overflow-x-auto">
            {result.headerJson}
          </pre>
        </div>
      )}

      {/* Payload */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <h3 className="text-sm font-semibold text-gray-400">Payload</h3>
            </div>
            <CopyBtn value={result.payloadJson} label="payload" />
          </div>
          <pre className="px-5 py-4 font-mono text-sm text-violet-300 overflow-x-auto">
            {result.payloadJson}
          </pre>
        </div>
      )}

      {/* 시간 클레임 분석 */}
      {result && Object.keys(result.timeFields).length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400">
              ⏱ 시간 클레임
            </h3>
          </div>
          <div className="divide-y divide-gray-800">
            {Object.values(result.timeFields).map((tf) => (
              <div
                key={tf.label}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs text-gray-500 block mb-0.5">
                    {tf.label}
                  </span>
                  <span className="font-mono text-sm text-gray-100">
                    {tf.date}
                  </span>
                  <span
                    className={`
                    text-xs ml-2
                    ${tf.isExpired === true ? "text-red-400" : "text-gray-500"}
                  `}
                  >
                    ({tf.relative})
                  </span>
                </div>
                <CopyBtn value={String(tf.timestamp)} label={tf.label} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payload 클레임 테이블 */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400">
              📋 모든 클레임
            </h3>
          </div>
          <div className="divide-y divide-gray-800">
            {Object.entries(result.payload).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-800/50 transition-colors"
              >
                <div className="min-w-0 flex-1 flex items-baseline gap-3">
                  <span className="font-mono text-xs text-blue-400 flex-shrink-0">
                    {key}
                  </span>
                  <span className="font-mono text-xs text-gray-300 truncate">
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </span>
                </div>
                <span className="text-[10px] text-gray-600 ml-2 flex-shrink-0">
                  {typeof value}
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
            💡 JWT 표준 클레임
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { claim: "iss", desc: "Issuer — 토큰 발급자" },
              { claim: "sub", desc: "Subject — 토큰 주제 (사용자 ID 등)" },
              { claim: "aud", desc: "Audience — 토큰 수신자" },
              { claim: "exp", desc: "Expiration — 토큰 만료 시간" },
              { claim: "nbf", desc: "Not Before — 토큰 활성 시작 시간" },
              { claim: "iat", desc: "Issued At — 토큰 발급 시간" },
              { claim: "jti", desc: "JWT ID — 토큰 고유 식별자" },
            ].map((item) => (
              <div
                key={item.claim}
                className="flex items-baseline gap-2 py-1.5"
              >
                <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded flex-shrink-0">
                  {item.claim}
                </span>
                <span className="text-xs text-gray-400">{item.desc}</span>
              </div>
            ))}
          </div>

          {/* 예제 토큰 */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <button
              onClick={() =>
                setInput(
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldi0yQSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxNjIzOTAyMiwiZXhwIjoxODE2MjM5MDIyfQ.demo_signature_here",
                )
              }
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              📝 예제 토큰으로 테스트 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
