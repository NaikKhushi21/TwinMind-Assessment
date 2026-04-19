export function sanitizeAssistantText(text) {
  const cleaned = String(text || "")
    .replace(/\r/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^\s{0,3}>+\s?/gm, "")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*[•▪◦]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*[-=]{3,}\s*$/gm, "")
    .replace(/\|/g, " ")
    .replace(/[\\#*_`~]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Improve readability in plain text:
  // 1) Turn inline section labels into blocks: "Topic: text Topic2: text"
  // 2) If still one dense paragraph, split between sentence boundaries.
  const withSectionBreaks = cleaned
    .replace(
      /^([A-Z][A-Za-z0-9/&\-\s]{2,36}:)\s*/,
      "$1\n"
    )
    .replace(
      /\s([A-Z][A-Za-z0-9/&\-\s]{2,36}:)\s/g,
      "\n\n$1\n"
    )
    .replace(/:\n\n+/g, ":\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!withSectionBreaks.includes("\n") && withSectionBreaks.length > 220) {
    return withSectionBreaks
      .replace(/([.!?])\s+(?=[A-Z])/g, "$1\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return withSectionBreaks;
}
