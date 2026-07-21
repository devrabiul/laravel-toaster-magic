import { Highlight, themes, type Language } from "prism-react-renderer";
import { useState } from "react";
import { useIsDark } from "../hooks/useIsDark";

interface CodeBlockProps {
  code: string;
  language?: Language;
  filename?: string;
}

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
    <path
      d="M5 15V5a2 2 0 0 1 2-2h10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function CodeBlock({ code, language = "tsx", filename }: CodeBlockProps) {
  const dark = useIsDark();
  const [copied, setCopied] = useState(false);
  const trimmed = code.replace(/\n$/, "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="code-block">
      <div className="code-block__head">
        {filename ? (
          <span className="code-block__filename">{filename}</span>
        ) : (
          <span className="code-block__lang">{language}</span>
        )}
        <button
          type="button"
          className={`code-block__copy${copied ? " copied" : ""}`}
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code to clipboard"}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <Highlight
        code={trimmed}
        language={language}
        theme={dark ? themes.vsDark : themes.github}
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre style={{ background: "transparent" }}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line });
              return (
                <div key={i} {...lineProps}>
                  {line.map((token, key) => {
                    const tokenProps = getTokenProps({ token });
                    return <span key={key} {...tokenProps} />;
                  })}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
