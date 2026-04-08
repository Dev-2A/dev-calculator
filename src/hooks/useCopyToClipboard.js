import { useToast } from "./useToast";

export function useCopyToClipboard() {
  const { addToast } = useToast();

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(label ? `${label} 복사됨` : "클립보드에 복사됨", "success");
      return true;
    } catch {
      addToast("복사에 실패했습니다", "error");
      return false;
    }
  };

  return { copy };
}
