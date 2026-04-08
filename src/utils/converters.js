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
