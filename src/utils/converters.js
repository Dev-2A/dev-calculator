//SECTION - 진수 변환
export function convertBase(value, fromBase) {
  const cleaned = value.trim();
  if (!cleaned) return null;

  let decimal;
  try {
    if (fromBase === 16) {
      const hex = cleaned.replace(/^0x/i, "");
      if (!/^[0-9a-fA-F]+$/.test(hex)) return null;
      decimal = parseInt(hex, 16);
    } else if (fromBase === 2) {
      const bin = cleaned.replace(/^0b/i, "");
      if (!/^[01]+$/.test(bin)) return null;
      decimal = parseInt(bin, 2);
    } else if (fromBase === 8) {
      const oct = cleaned.replace(/^0o/i, "");
      if (!/^[0-7]+$/.test(oct)) return null;
      decimal = parseInt(oct, 8);
    } else {
      if (!/^-?\d+$/.test(cleaned)) return null;
      decimal = parseInt(cleaned, 10);
    }
  } catch {
    return null;
  }

  if (isNaN(decimal)) return null;

  return {
    decimal,
    binary: decimal.toString(2),
    octal: decimal.toString(8),
    hex: decimal.toString(16).toUpperCase(),
    // 보기 편하게 포맷팅된 버전
    binaryFormatted: formatBinary(decimal.toString(2)),
    hexFormatted: "0x" + decimal.toString(16).toUpperCase(),
    octalFormatted: "0o" + decimal.toString(8),
  };
}

function formatBinary(bin) {
  // 4자리마다 공백 구분 (뒤에서부터)
  return bin
    .split("")
    .reverse()
    .reduce((acc, digit, i) => {
      if (i > 0 && i % 4 === 0) acc.push(" ");
      acc.push(digit);
      return acc;
    }, [])
    .reverse()
    .join("");
}

//SECTION - Unix 타임스탬프 변환
export function timestampToDate(timestamp) {
  const cleaned = String(timestamp).trim();
  if (!cleaned || !/^-?\d+$/.test(cleaned)) return null;

  let ts = parseInt(cleaned, 10);

  // 13자리면 밀리초, 10자리면 초 단위로 판단
  const unit = cleaned.replace(/^-/, "").length >= 13 ? "ms" : "s";
  const ms = unit === "ms" ? ts : ts * 1000;

  const date = new Date(ms);
  if (isNaN(date.getTime())) return null;

  return {
    unit,
    timestampSec: Math.floor(ms / 1000),
    timestampMs: ms,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
    relative: getRelativeTime(ms),
    breakdown: {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      dayOfWeek: ["일", "월", "화", "수", "목", "금", "토"][date.getDay()],
    },
  };
}

export function dateToTimestamp(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  return {
    timestampSec: Math.floor(date.getTime() / 1000),
    timestampMs: date.getTime(),
  };
}

function getRelativeTime(ms) {
  const now = Date.now();
  const diff = ms - now;
  const absDiff = Math.abs(diff);
  const isFuture = diff > 0;

  const units = [
    { label: "년", value: 365.25 * 24 * 60 * 60 * 1000 },
    { label: "개월", value: 30.44 * 24 * 60 * 60 * 1000 },
    { label: "일", value: 24 * 60 * 60 * 1000 },
    { label: "시간", value: 60 * 60 * 1000 },
    { label: "분", value: 60 * 1000 },
    { label: "초", value: 1000 },
  ];

  for (const unit of units) {
    const count = Math.floor(absDiff / unit.value);
    if (count >= 1) {
      return isFuture ? `${count}${unit.label} 후` : `${count}${unit.label} 전`;
    }
  }
  return "방금 지금";
}

//SECTION - 바이트 단위 변환
const byteUnits = [
  { key: "b", label: "Bytes (B)", factor: 1 },
  { key: "kb", label: "Kilobytes (KB)", factor: 1024 },
  { key: "mb", label: "Megabytes (MB)", factor: 1024 ** 2 },
  { key: "gb", label: "Gigabytes (GB)", factor: 1024 ** 3 },
  { key: "tb", label: "Terabytes (TB)", factor: 1024 ** 4 },
  { key: "pb", label: "Petabytes (PB)", factor: 1024 ** 5 },
];

const siUnits = [
  { key: "b", label: "Bytes (B)", factor: 1 },
  { key: "kb", label: "Kilobytes (KB)", factor: 1000 },
  { key: "mb", label: "Megabytes (MB)", factor: 1000 ** 2 },
  { key: "gb", label: "Gigabytes (GB)", factor: 1000 ** 3 },
  { key: "tb", label: "Terabytes (TB)", factor: 1000 ** 4 },
  { key: "pb", label: "Petabytes (PB)", factor: 1000 ** 5 },
];

export function convertBytes(value, fromUnit, useSI = false) {
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return null;

  const units = useSI ? siUnits : byteUnits;
  const from = units.find((u) => u.key === fromUnit);
  if (!from) return null;

  const bytes = num * from.factor;

  return units.map((unit) => ({
    key: unit.key,
    label: unit.label,
    value: bytes / unit.factor,
    formatted: formatByteValue(bytes / unit.factor),
    bytes,
  }));
}

function formatByteValue(val) {
  if (val === 0) return "0";
  if (Number.isInteger(val)) return val.toLocaleString();
  // 소수점 이하는 유효숫자 기준으로 보기 좋게 표시
  if (val >= 1)
    return val.toLocaleString(undefined, { maximumFractionDigits: 4 });
  // 1 미만의 작은 수 → 소수점으로 표시 (지수 표기 X)
  const str = val.toFixed(20);
  // 유효숫자 4자리까지만 보존
  const match = str.match(/^0\.(0*?)(\d{1,4})/);
  if (match) return `0.${match[1]}${match[2]}`;
  return str;
}

export { byteUnits, siUnits };
