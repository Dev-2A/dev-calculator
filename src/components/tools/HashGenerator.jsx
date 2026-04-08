import { useState, useEffect, useRef } from "react";
import { generateHashes } from "../../utils/converters";
import CopyButton from "../common/CopyButton";

const hashInfo = [
  {
    key: "md5",
    label: "MD5",
    bits: 128,
    status: "⚠️ 취약",
    statusColor: "text-red-400",
  },
  {
    key: "sha1",
    label: "SHA-1",
    bits: 160,
    status: "⚠️ 취약",
    statusColor: "text-red-400",
  },
  {
    key: "sha256",
    label: "SHA-256",
    bits: 256,
    status: "✅ 권장",
    statusColor: "text-green-400",
  },
  {
    key: "sha384",
    label: "SHA-384",
    bits: 384,
    status: "✅ 안전",
    statusColor: "text-green-400",
  },
  {
    key: "sha512",
    label: "SHA-512",
    bits: 512,
    status: "✅ 안전",
    statusColor: "text-green-400",
  },
];

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [compareHash, setCompareHash] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const [uppercase, setUppercase] = useState(false);
  const debounceRef = useRef(null);

  // 디바운스로 해시 계산 (async)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setResult(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const hashes = await generateHashes(input);
      setResult(hashes);
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  const formatHash = (hash) => (uppercase ? hash.toUpperCase() : hash);

  // 비교 결과
  const compareResult = (() => {
    if (!compareHash.trim() || !result) return null;
    const normalized = compareHash.trim().toLowerCase();
    for (const info of hashInfo) {
      if (result[info.key] === normalized) {
        return { match: true, algo: info.label };
      }
    }
    return { match: false, algo: null };
  })();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">🔒 Hash 생성기</h2>
        <p className="text-sm text-gray-500">
          텍스트를 입력하면 MD5, SHA-1, SHA-256, SHA-384, SHA-512 해시를
          생성합니다.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">입력 텍스트</label>
          <button
            onClick={() => setUppercase(!uppercase)}
            className={`
              px-3 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer
              ${
                uppercase
                  ? "bg-blue-600/15 border border-blue-500/30 text-blue-400"
                  : "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700"
              }
            `}
          >
            {uppercase ? "UPPERCASE" : "lowercase"}
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="해시를 생성할 텍스트를 입력하세요"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                     font-mono text-sm text-gray-100 placeholder-gray-600 resize-none
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {result && (
          <p className="text-xs text-gray-600">
            입력 크기: {result.inputSize} bytes
          </p>
        )}
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400">해시 결과</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {hashInfo.map((info) => {
              const hash = result[info.key];
              if (!hash) return null;
              const display = formatHash(hash);
              return (
                <div
                  key={info.key}
                  className="px-5 py-3 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-300">
                        {info.label}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {info.bits}bit
                      </span>
                      <span className={`text-[10px] ${info.statusColor}`}>
                        {info.status}
                      </span>
                    </div>
                    <CopyButton value={display} label={info.label} />
                  </div>
                  <p className="font-mono text-xs text-gray-100 break-all select-all leading-relaxed">
                    {display}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 해시 비교 */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-800/50
                       transition-colors cursor-pointer"
          >
            <h3 className="text-sm font-semibold text-gray-400">
              🔍 해시 비교
            </h3>
            <span className="text-gray-500 text-sm">
              {showCompare ? "▲" : "▼"}
            </span>
          </button>

          {showCompare && (
            <div className="px-5 pb-5 space-y-3">
              <p className="text-xs text-gray-600">
                기존 해시 값을 붙여넣으면 위 결과와 일치하는지 확인합니다.
              </p>
              <input
                type="text"
                value={compareHash}
                onChange={(e) => setCompareHash(e.target.value)}
                placeholder="비교할 해시 값을 붙여넣으세요"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                           font-mono text-sm text-gray-100 placeholder-gray-600
                           focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {compareResult && (
                <div
                  className={`
                    p-3 rounded-lg text-sm font-medium
                    ${
                      compareResult.match
                        ? "bg-green-500/10 border border-green-500/20 text-green-400"
                        : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }
                  `}
                >
                  {compareResult.match
                    ? `✅ 일치! (${compareResult.algo})`
                    : "❌ 어떤 해시 알고리즘과도 일치하지 않습니다."}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 빠른 참조 */}
      {!input && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            💡 해시 알고리즘 비교
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-800">
                  <th className="text-left py-2 pr-4 font-normal">알고리즘</th>
                  <th className="text-left py-2 pr-4 font-normal">길이</th>
                  <th className="text-left py-2 pr-4 font-normal">보안</th>
                  <th className="text-left py-2 font-normal">용도</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  {
                    algo: "MD5",
                    len: "32자 (128bit)",
                    sec: "취약",
                    use: "체크섬 (비보안)",
                  },
                  {
                    algo: "SHA-1",
                    len: "40자 (160bit)",
                    sec: "취약",
                    use: "Git 커밋 해시 (레거시)",
                  },
                  {
                    algo: "SHA-256",
                    len: "64자 (256bit)",
                    sec: "안전",
                    use: "서명, 인증서, 블록체인",
                  },
                  {
                    algo: "SHA-384",
                    len: "96자 (384bit)",
                    sec: "안전",
                    use: "TLS 1.2+",
                  },
                  {
                    algo: "SHA-512",
                    len: "128자 (512bit)",
                    sec: "안전",
                    use: "높은 보안 요구 시",
                  },
                ].map((row) => (
                  <tr key={row.algo} className="border-b border-gray-800/50">
                    <td className="py-2 pr-4 font-mono text-xs text-gray-200">
                      {row.algo}
                    </td>
                    <td className="py-2 pr-4 text-xs">{row.len}</td>
                    <td className="py-2 pr-4 text-xs">
                      <span
                        className={
                          row.sec === "취약" ? "text-red-400" : "text-green-400"
                        }
                      >
                        {row.sec}
                      </span>
                    </td>
                    <td className="py-2 text-xs">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 예제 */}
          <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-3">
            <button
              onClick={() => setInput("hello")}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              📝 "hello" 해시 테스트 →
            </button>
            <button
              onClick={() => setInput("password123")}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              📝 "password123" 해시 테스트 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
