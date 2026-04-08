import { useState } from "react";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

export default function CopyButton({ value, label, size = "sm" }) {
  const { copy } = useCopyToClipboard();
  const [justCopied, setJustCopied] = useState(false);

  const handleClick = async () => {
    const ok = await copy(value, label);
    if (ok) {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 1500);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        rounded-md bg-gray-800 transition-all cursor-pointer shrink-0
        ${
          justCopied
            ? "text-green-400 bg-green-500/10"
            : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
        }
        ${size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}
      `}
    >
      {justCopied ? "✓ 복사됨" : "복사"}
    </button>
  );
}
