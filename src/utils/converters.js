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

//SECTION - JWT 디코더
export function decodeJwt(token) {
  const trimmed = token.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(".");
  if (parts.length !== 3) return null;

  try {
    const header = safeBase64Decode(parts[0]);
    const payload = safeBase64Decode(parts[1]);

    if (!header || !payload) return null;

    const headerObj = JSON.parse(header);
    const payloadObj = JSON.parse(payload);

    // 시간 관련 클레임 분석
    const timeFields = {};
    const now = Math.floor(Date.now() / 1000);

    if (payloadObj.iat) {
      timeFields.iat = {
        label: "Issued At (iat)",
        timestamp: payloadObj.iat,
        date: new Date(payloadObj.iat * 1000).toLocaleString("ko-KR", {
          hour12: false,
        }),
        relative: getJwtRelativeTime(payloadObj.iat, now),
      };
    }
    if (payloadObj.exp) {
      const isExpired = payloadObj.exp < now;
      timeFields.exp = {
        label: "Expiration (exp)",
        timestamp: payloadObj.exp,
        date: new Date(payloadObj.exp * 1000).toLocaleString("ko-KR", {
          hour12: false,
        }),
        relative: getJwtRelativeTime(payloadObj.exp, now),
        isExpired,
      };
    }
    if (payloadObj.nbf) {
      timeFields.nbf = {
        label: "Not Before (nbf)",
        timestamp: payloadObj.nbf,
        date: new Date(payloadObj.nbf * 1000).toLocaleString("ko-KR", {
          hour12: false,
        }),
        relative: getJwtRelativeTime(payloadObj.nbf, now),
      };
    }

    return {
      header: headerObj,
      payload: payloadObj,
      signature: parts[2],
      headerRaw: header,
      payloadRaw: payload,
      headerJson: JSON.stringify(headerObj, null, 2),
      payloadJson: JSON.stringify(payloadObj, null, 2),
      timeFields,
      isExpired: timeFields.exp?.isExpired ?? null,
    };
  } catch {
    return null;
  }
}

function safeBase64Decode(str) {
  try {
    // Base64URL → Base64
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
  } catch {
    return null;
  }
}

function getJwtRelativeTime(ts, now) {
  const diff = ts - now;
  const absDiff = Math.abs(diff);
  const isFuture = diff > 0;

  const units = [
    { label: "일", value: 86400 },
    { label: "시간", value: 3600 },
    { label: "분", value: 60 },
    { label: "초", value: 1 },
  ];

  for (const unit of units) {
    const count = Math.floor(absDiff / unit.value);
    if (count >= 1) {
      return isFuture ? `${count}${unit.label} 후` : `${count}${unit.label} 전`;
    }
  }
  return "지금";
}

//SECTION - URL 인코더/디코더
export function encodeUrl(input, mode = "component") {
  if (!input) return null;
  try {
    const encoded =
      mode === "component" ? encodeURIComponent(input) : encodeURI(input);
    return {
      encoded,
      charCount: input.length,
      encodedCharCount: encoded.length,
      sizeDiff: encoded.length - input.length,
    };
  } catch {
    return null;
  }
}

export function decodeUrl(input) {
  if (!input) return null;
  try {
    // 이중 인코딩 감지
    const decoded = decodeURIComponent(input);
    let doubleDecoded = null;
    try {
      const second = decodeURIComponent(decoded);
      if (second !== decoded) doubleDecoded = second;
    } catch {
      /* 이중 인코딩 아님 */
    }

    return {
      decoded,
      doubleDecoded,
      charCount: input.length,
      decodedCharCount: decoded.length,
    };
  } catch {
    return null;
  }
}

export function parseUrlParts(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    // 프로토콜이 없으면 임시로 붙여서 파싱
    const hasProtocol = /^[a-zA-Z]+:\/\//.test(trimmed);
    const urlStr = hasProtocol ? trimmed : `https://${trimmed}`;
    const url = new URL(urlStr);

    const params = [];
    url.searchParams.forEach((value, key) => {
      params.push({
        key,
        value,
        keyDecoded: decodeURIComponent(key),
        valueDecoded: decodeURIComponent(value),
      });
    });

    return {
      protocol: url.protocol.replace(":", ""),
      host: url.host,
      hostname: url.hostname,
      port: url.port || null,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      params,
      origin: url.origin,
      hasProtocol,
    };
  } catch {
    return null;
  }
}

//SECTION - Base64 인코더/디코더
export function encodeBase64(input, urlSafe = false) {
  if (!input) return null;
  try {
    // UTF-8 지원을 위해 TextEncoder 사용
    const bytes = new TextEncoder().encode(input);
    const binary = Array.from(bytes)
      .map((b) => String.fromCharCode(b))
      .join("");
    let encoded = btoa(binary);

    if (urlSafe) {
      encoded = encoded
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    return {
      encoded,
      originalSize: new Blob([input]).size,
      encodedSize: encoded.length,
      ratio: ((encoded.length / new Blob([input]).size) * 100).toFixed(1),
    };
  } catch {
    return null;
  }
}

export function decodeBase64(input) {
  if (!input) return null;
  try {
    // Base64URL → Base64 변환
    let base64 = input.trim().replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);

    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

    // 텍스트 디코딩 시도
    let text = null;
    let isText = true;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      isText = false;
    }

    // 이미지 감지 (PNG, JPEG, GIF< WebP)
    const imageType = detectImageType(bytes);

    return {
      text,
      isText,
      imageType,
      byteLength: bytes.length,
      decodedSize: text ? new Blob([text]).size : bytes.length,
      hexDump: generateHexDump(bytes, 64), // 처음 64바이트만
      dataUri: imageType
        ? `data:image/${imageType};base64,${input.trim()}`
        : null,
    };
  } catch {
    return null;
  }
}

function detectImageType(bytes) {
  if (bytes.length < 4) return null;
  // PNG
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  )
    return "png";
  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "jpeg";
  // GIF
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "gif";
  // WebP
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return "webp";
  return null;
}

function generateHexDump(bytes, maxBytes) {
  const lines = [];
  const limit = Math.min(bytes.length, maxBytes);
  for (let i = 0; i < limit; i += 16) {
    const slice = bytes.slice(i, Math.min(i + 16, limit));
    const hex = Array.from(slice)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
    const ascii = Array.from(slice)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : "."))
      .join("");
    lines.push({
      offset: i.toString(16).padStart(8, "0"),
      hex: hex.padEnd(47, " "),
      ascii,
    });
  }
  return {
    lines,
    truncated: bytes.length > maxBytes,
    totalBytes: bytes.length,
  };
}

//SECTION - Hash 생성기
export async function generateHashes(input) {
  if (!input) return null;

  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  const [sha1, sha256, sha384, sha512] = await Promise.all([
    cryptoHash("SHA-1", data),
    cryptoHash("SHA-256", data),
    cryptoHash("SHA-384", data),
    cryptoHash("SHA-512", data),
  ]);

  const md5 = calcMD5(input);

  return {
    md5,
    sha1,
    sha256,
    sha384,
    sha512,
    inputSize: data.length,
  };
}

async function cryptoHash(algo, data) {
  const buffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function calcMD5(string) {
  const k = [];
  for (let i = 0; i < 64; i++) {
    k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
  }

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
    9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
    16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10,
    15, 21,
  ];

  // UTF-8 인코딩
  const bytes = new TextEncoder().encode(string);
  const bitLen = bytes.length * 8;

  // 패딩
  const padded = [];
  for (let i = 0; i < bytes.length; i++) padded.push(bytes[i]);
  padded.push(0x80);
  while (padded.length % 64 !== 56) padded.push(0);

  // 길이 추가 (리틀 엔디안, 64비트)
  for (let i = 0; i < 8; i++) {
    padded.push((bitLen >>> (i * 8)) & 0xff);
  }

  let a0 = 0x67452301 >>> 0;
  let b0 = 0xefcdab89 >>> 0;
  let c0 = 0x98badcfe >>> 0;
  let d0 = 0x10325476 >>> 0;

  for (let offset = 0; offset < padded.length; offset += 64) {
    const M = [];
    for (let j = 0; j < 16; j++) {
      M[j] =
        padded[offset + j * 4] |
        (padded[offset + j * 4 + 1] << 8) |
        (padded[offset + j * 4 + 2] << 16) |
        (padded[offset + j * 4 + 3] << 24);
      M[j] = M[j] >>> 0;
    }

    let A = a0,
      B = b0,
      C = c0,
      D = d0;

    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }

      F = F >>> 0;
      const temp = D;
      D = C;
      C = B;
      const sum = (A + F + k[i] + M[g]) >>> 0;
      B = (B + ((sum << s[i]) | (sum >>> (32 - s[i])))) >>> 0;
      A = temp;
    }

    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  const toHex = (val) =>
    [0, 8, 16, 24]
      .map((shift) => ((val >>> shift) & 0xff).toString(16).padStart(2, "0"))
      .join("");

  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

//SECTION - JSON Formatter / Validator
export function formatJson(input, indent = 2) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    const formatted = JSON.stringify(parsed, null, indent);
    const minified = JSON.stringify(parsed);

    return {
      parsed,
      formatted,
      minified,
      valid: true,
      stats: analyzeJson(parsed),
      originalSize: new Blob([trimmed]).size,
      formattedSize: new Blob([formatted]).size,
      minifiedSize: new Blob([minified]).size,
    };
  } catch (err) {
    // 에러 위치 파싱
    const posMatch = err.message.match(/position\s+(\d+)/i);
    const pos = posMatch ? parseInt(posMatch[1], 10) : null;

    let line = null;
    let column = null;
    if (pos !== null) {
      const before = trimmed.substring(0, pos);
      line = (before.match(/\n/g) || []).length + 1;
      column = pos - before.lastIndexOf("\n");
    }

    return {
      valid: false,
      error: err.message,
      errorPos: pos,
      errorLine: line,
      errorColumn: column,
    };
  }
}

function analyzeJson(value, depth = 0) {
  const stats = {
    totalKeys: 0,
    totalValues: 0,
    maxDepth: depth,
    types: { string: 0, number: 0, boolean: 0, null: 0, object: 0, array: 0 },
  };

  if (value === null) {
    stats.types.null++;
    stats.totalValues++;
    return stats;
  }

  if (Array.isArray(value)) {
    stats.types.array++;
    for (const item of value) {
      const child = analyzeJson(item, depth + 1);
      mergeStats(stats, child);
    }
    return stats;
  }

  if (typeof value === "object") {
    stats.types.object++;
    const keys = Object.keys(value);
    stats.totalKeys += keys.length;
    for (const key of keys) {
      const child = analyzeJson(value[key], depth + 1);
      mergeStats(stats, child);
    }
    return stats;
  }

  stats.types[typeof value]++;
  stats.totalValues++;
  return stats;
}

function mergeStats(target, source) {
  target.totalKeys += source.totalKeys;
  target.totalValues += source.totalValues;
  target.maxDepth = Math.max(target.maxDepth, source.maxDepth);
  for (const type in source.types) {
    target.types[type] += source.types[type];
  }
}
