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

//SECTION - 색상 코드 변환
export function parseColor(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // HEX
  const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3)
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return buildColorResult(r, g, b);
  }

  // RGB: rgb(r, g, b) 또는 r, g, b 또는 r g b
  const rgbMatch = trimmed.match(
    /^(?:rgba?\s*\(\s*)?(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*\)?$/i,
  );
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (r > 255 || g > 255 || b > 255) return null;
    return buildColorResult(r, g, b);
  }

  // HSL: hsl(h, s%, l%) 또는 h, s, l
  const hslMatch = trimmed.match(
    /^(?:hsla?\s*\(\s*)?(\d{1,3}(?:\.\d+)?)\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?\s*\)?$/i,
  );
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);
    if (h > 360 || s > 100 || l > 100) return null;
    const { r, g, b } = hslToRgb(h, s, l);
    return buildColorResult(r, g, b);
  }

  return null;
}

function buildColorResult(r, g, b) {
  const hex =
    "#" +
    [r, g, b]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  const { h, s, l } = rgbToHsl(r, g, b);

  return {
    hex,
    rgb: { r, g, b },
    hsl: { h, s, l },
    cssRgb: `rgb(${r}, ${g}, ${b})`,
    cssHsl: `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`,
    // 밝기 판단 (텍스트 색상용)
    isDark: (r * 299 + g * 587 + b * 114) / 1000 < 128,
  };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}
