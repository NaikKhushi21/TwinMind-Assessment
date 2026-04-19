import { memo } from "react";
import { sanitizeAssistantText } from "../../utils/text";

function isSectionLabel(line) {
  return /^[A-Z][A-Za-z0-9/&\-\s]{2,36}:\s*(.*)$/.test(line);
}

function parseAssistantSections(text) {
  const lines = String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = [];
  let current = null;

  for (const line of lines) {
    const match = line.match(/^([A-Z][A-Za-z0-9/&\-\s]{2,36}:)\s*(.*)$/);
    if (match && isSectionLabel(line)) {
      if (current) {
        sections.push(current);
      }
      current = {
        title: match[1],
        body: match[2] ? [match[2]] : []
      };
      continue;
    }

    if (!current) {
      current = { title: "", body: [line] };
      continue;
    }

    current.body.push(line);
  }

  if (current) {
    sections.push(current);
  }

  return sections.length ? sections : [{ title: "", body: [String(text || "").trim()] }];
}

function ChatMessage({ message }) {
  const content =
    message.role === "assistant"
      ? sanitizeAssistantText(message.content)
      : message.content;
  const sections =
    message.role === "assistant"
      ? parseAssistantSections(content)
      : [{ title: "", body: [content] }];

  return (
    <article className={`chat-message ${message.role}`}>
      <p className="chat-meta">
        {message.role}
        {message.label ? ` • ${message.label}` : ""}
      </p>
      <div className="chat-content">
        {sections.map((section, index) => (
          <p key={`${section.title || "plain"}-${index}`} className="chat-content-line">
            {section.title ? <strong className="chat-section-title">{section.title}</strong> : null}
            {section.title && section.body.length ? " " : ""}
            {section.body.join(" ").trim()}
          </p>
        ))}
      </div>
    </article>
  );
}

export default memo(ChatMessage);
