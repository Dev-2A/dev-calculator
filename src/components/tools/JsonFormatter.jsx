import { useState, useMemo } from "react";
import { formatJson } from "../../utils/converters";
import CopyButton from "../common/CopyButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [viewMode, setViewMode] = useState("formatted"); // 'formatted' | 'minified' | 'tree'

  const result = useMemo(() => formatJson(input, indent), [input, indent]);

  const handlePrettify = () => {
    if (result?.valid) {
      setInput(result.formatted);
    }
  };

  const handleMinify = () => {
    if (result?.valid) {
      setInput(result.minified);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">📋 JSON Formatter</h2>
        <p className="text-sm text-gray-500">
          JSON을 검증하고, 정리(Prettify)하거나 압축(Minify)합니다.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">JSON 입력</label>
            {result && (
              <span
                className={`
                  text-xs px-2.5 py-1 rounded-full font-medium
                  ${
                    result.valid
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  }
                `}
              >
                {result.valid ? "✅ Valid" : "❌ Invalid"}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrettify}
              disabled={!result?.valid}
              className="px-3 py-1.5 text-xs rounded-lg bg-blue-600/15 text-blue-400
                         hover:bg-blue-600/25 transition-colors cursor-pointer
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prettify ↓
            </button>
            <button
              onClick={handleMinify}
              disabled={!result?.valid}
              className="px-3 py-1.5 text-xs rounded-lg bg-violet-600/15 text-violet-400
                         hover:bg-violet-600/25 transition-colors cursor-pointer
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Minify ↓
            </button>
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            '{\n  "name": "Dev-2A",\n  "role": "developer",\n  "tools": ["React", "Vite", "Tailwind"]\n}'
          }
          rows={8}
          spellCheck={false}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                     font-mono text-sm text-gray-100 placeholder-gray-600 resize-y
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        {/* 에러 표시 */}
        {result && !result.valid && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="text-red-400 flex-shrink-0">❌</span>
              <div>
                <p className="text-sm text-red-400 font-medium">
                  JSON 파싱 오류
                </p>
                <p className="text-xs text-red-300/80 mt-1 font-mono">
                  {result.error}
                </p>
                {result.errorLine && (
                  <p className="text-xs text-red-400/60 mt-1">
                    위치: {result.errorLine}행 {result.errorColumn}열
                    {result.errorPos !== null && ` (offset ${result.errorPos})`}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 출력 영역 */}
      {result?.valid && (
        <>
          {/* 뷰 모드 전환 + 인덴트 설정 */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2">
              {[
                { id: "formatted", label: "Formatted" },
                { id: "minified", label: "Minified" },
                { id: "tree", label: "Tree View" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setViewMode(m.id)}
                  className={`
                    px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer
                    ${
                      viewMode === m.id
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                    }
                  `}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {viewMode === "formatted" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Indent:</span>
                {[2, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setIndent(n)}
                    className={`
                      px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer
                      ${
                        indent === n
                          ? "bg-blue-600/20 text-blue-400"
                          : "bg-gray-800 text-gray-500 hover:text-gray-300"
                      }
                    `}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Formatted / Minified 뷰 */}
          {(viewMode === "formatted" || viewMode === "minified") && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-400">
                  {viewMode === "formatted" ? "Formatted" : "Minified"}
                </h3>
                <CopyButton
                  value={viewMode === 'formatted' ? result.formatted : result.minified}
                  label={viewMode === 'formatted' ? 'Formatted JSON' : 'Minified JSON'}
                />
              </div>
              <pre className="px-5 py-4 font-mono text-sm text-gray-100 overflow-x-auto max-h-96 overflow-y-auto">
                {viewMode === "formatted" ? (
                  <JsonSyntaxHighlight json={result.formatted} />
                ) : (
                  <span className="text-gray-300 break-all whitespace-pre-wrap">
                    {result.minified}
                  </span>
                )}
              </pre>
            </div>
          )}

          {/* Tree View */}
          {viewMode === "tree" && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400">
                  Tree View
                </h3>
              </div>
              <div className="px-5 py-4 max-h-96 overflow-y-auto">
                <JsonTreeNode value={result.parsed} />
              </div>
            </div>
          )}

          {/* 통계 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">
              📊 JSON 분석
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                {
                  label: "Keys",
                  value: result.stats.totalKeys,
                  color: "text-blue-400",
                },
                {
                  label: "Values",
                  value: result.stats.totalValues,
                  color: "text-green-400",
                },
                {
                  label: "Depth",
                  value: result.stats.maxDepth,
                  color: "text-violet-400",
                },
                {
                  label: "Objects",
                  value: result.stats.types.object,
                  color: "text-yellow-400",
                },
                {
                  label: "Arrays",
                  value: result.stats.types.array,
                  color: "text-cyan-400",
                },
                {
                  label: "Strings",
                  value: result.stats.types.string,
                  color: "text-orange-400",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-800/50 rounded-lg p-3 text-center"
                >
                  <span className="text-xs text-gray-500 block mb-1">
                    {stat.label}
                  </span>
                  <span className={`font-mono text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* 크기 비교 */}
            <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-xs text-gray-500 block mb-1">원본</span>
                <span className="font-mono text-sm text-gray-300">
                  {result.originalSize} B
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  Formatted
                </span>
                <span className="font-mono text-sm text-gray-300">
                  {result.formattedSize} B
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  Minified
                </span>
                <span className="font-mono text-sm text-green-400">
                  {result.minifiedSize} B
                </span>
                {result.originalSize > result.minifiedSize && (
                  <span className="text-[10px] text-green-500 block">
                    (-
                    {Math.round(
                      (1 - result.minifiedSize / result.originalSize) * 100,
                    )}
                    %)
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 빠른 참조 */}
      {!input && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            💡 예제 JSON
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              {
                label: "기본 객체",
                value:
                  '{\n  "name": "Dev-2A",\n  "role": "developer",\n  "skills": ["React", "Python", "FastAPI"],\n  "experience": 2,\n  "active": true\n}',
              },
              {
                label: "중첩 구조",
                value:
                  '{\n  "users": [\n    {\n      "id": 1,\n      "name": "Alice",\n      "address": {\n        "city": "Seoul",\n        "zip": "06000"\n      },\n      "tags": ["admin", "dev"]\n    },\n    {\n      "id": 2,\n      "name": "Bob",\n      "address": {\n        "city": "Busan",\n        "zip": "48000"\n      },\n      "tags": ["user"]\n    }\n  ],\n  "total": 2\n}',
              },
              {
                label: "잘못된 JSON",
                value: '{"name": "test", "value": undefined, }',
              },
            ].map((ex) => (
              <button
                key={ex.label}
                onClick={() => setInput(ex.value)}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                📝 {ex.label} →
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── 구문 하이라이팅 ──
function JsonSyntaxHighlight({ json }) {
  const lines = json.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="text-gray-700 select-none w-8 text-right mr-4 shrink-0 text-xs leading-5">
            {i + 1}
          </span>
          <span
            className="leading-5"
            dangerouslySetInnerHTML={{ __html: highlightLine(line) }}
          />
        </div>
      ))}
    </>
  );
}

function highlightLine(line) {
  return (
    line
      // 키 (쌍따옴표 + 콜론)
    .replace(/"([^"]+)"(\s*:)/g, '<span class="text-blue-400">"$1"</span>$2')
    // 문자열 값 (콜론 뒤)
    .replace(/:\s*"([^"]*)"/g, ': <span class="text-green-400">"$1"</span>')
    // 숫자
    .replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="text-orange-400">$1</span>')
    // boolean
    .replace(/:\s*(true|false)/g, ': <span class="text-violet-400">$1</span>')
    // null
    .replace(/:\s*(null)/g, ': <span class="text-red-400">$1</span>')
  );
}

// ── 트리 뷰 ──
function JsonTreeNode({ value, keyName, isLast = true, depth = 0 }) {
  const [collapsed, setCollapsed] = useState(depth > 2);

  if (value === null) {
    return (
      <TreeLine keyName={keyName} isLast={isLast}>
        <span className="text-red-400">null</span>
      </TreeLine>
    );
  }

  if (typeof value === "boolean") {
    return (
      <TreeLine keyName={keyName} isLast={isLast}>
        <span className="text-violet-400">{String(value)}</span>
      </TreeLine>
    );
  }

  if (typeof value === "number") {
    return (
      <TreeLine keyName={keyName} isLast={isLast}>
        <span className="text-orange-400">{value}</span>
      </TreeLine>
    );
  }

  if (typeof value === "string") {
    return (
      <TreeLine keyName={keyName} isLast={isLast}>
        <span className="text-green-400">"{value}"</span>
      </TreeLine>
    );
  }

  const isArray = Array.isArray(value);
  const entries = isArray ? value.map((v, i) => [i, v]) : Object.entries(value);

  return (
    <div className="text-sm font-mono">
      <div
        className="flex items-center gap-1 cursor-pointer hover:bg-gray-800/50 rounded px-1 -ml-1"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-gray-600 text-xs w-4 text-center select-none">
          {collapsed ? "▶" : "▼"}
        </span>
        {keyName !== undefined && (
          <span className="text-blue-400">"{keyName}"</span>
        )}
        {keyName !== undefined && <span className="text-gray-500">: </span>}
        <span className="text-gray-500">{isArray ? "[" : "{"}</span>
        {collapsed && (
          <span className="text-gray-600 text-xs ml-1">
            {entries.length} {isArray ? "items" : "keys"}
          </span>
        )}
        {collapsed && (
          <span className="text-gray-500">{isArray ? "]" : "}"}</span>
        )}
      </div>
      {!collapsed && (
        <div className="ml-5 border-l border-gray-800 pl-3">
          {entries.map(([key, val], i) => (
            <JsonTreeNode
              key={String(key)}
              value={val}
              keyName={isArray ? undefined : key}
              isLast={i === entries.length - 1}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
      {!collapsed && (
        <div className="flex items-center">
          <span className="w-4" />
          <span className="text-gray-500">{isArray ? "]" : "}"}</span>
        </div>
      )}
    </div>
  );
}

function TreeLine({ keyName, children, isLast }) {
  return (
    <div className="flex items-center gap-1 text-sm font-mono py-0.5">
      <span className="w-4" />
      {keyName !== undefined && (
        <>
          <span className="text-blue-400">"{keyName}"</span>
          <span className="text-gray-500">: </span>
        </>
      )}
      {children}
      {!isLast && <span className="text-gray-600">,</span>}
    </div>
  );
}
