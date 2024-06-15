"use client";

import { ChangeEvent, KeyboardEvent, useRef } from "react";
import { Highlight, themes } from "prism-react-renderer";

interface CodeEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  language: string;
  className?: string;
  tabSize?: number;
}

export default function CodeEditor(props: CodeEditorProps) {
  const textAreaRef = useRef(null);

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    let text = event.currentTarget.value;
    props.onValueChange(text);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const key = event.key;
    const { selectionStart, selectionEnd } = event.currentTarget;
    if (key === "Tab") {
      event.preventDefault();

      if (selectionStart === selectionEnd) {
        // insert tab
        const tabSize = props.tabSize ?? 2;
        const tabValue = "\t".repeat(tabSize);
        const value =
          props.value.substring(0, selectionStart) +
          tabValue +
          props.value.substring(selectionEnd);

        props.onValueChange(value);
      }
    }
  };

  return (
    <div
      className={`${props.className} relative text-left overflow-hidden box-border font-mono`}
    >
      <Highlight
        // theme={themes.oneLight}
        code={props.value}
        language={props.language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            style={{ ...style, ...styles.editor, ...styles.highlight }}
            className={className}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {/* <span className="pr-5 pl-3">{i + 1}</span> */}
                {line.map((token, key) => (
                  <span
                    key={key}
                    style={{ ...styles.highlight }}
                    {...getTokenProps({ token })}
                  />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>

      <textarea
        ref={textAreaRef}
        className="absolute top-0 left-0 h-full w-full resize-none text-inherit overflow-hidden antialiased text-white"
        value={props.value}
        style={{
          ...styles.editor,
          WebkitTextFillColor: "transparent",
        }}
        onChange={onChange}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  );
}

const styles = {
  highlight: {
    position: "relative",
    pointerEvents: "none",
  },
  editor: {
    margin: 0,
    border: 0,
    background: "none",
    boxSizing: "inherit",
    display: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontStyle: "inherit",
    fontVariantLigatures: "inherit",
    fontWeight: "inherit",
    letterSpacing: "inherit",
    lineHeight: "inherit",
    tabSize: "inherit",
    textIndent: "inherit",
    textRendering: "inherit",
    textTransform: "inherit",
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    overflowWrap: "break-word",
  },
} as const;
