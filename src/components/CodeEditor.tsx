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

interface TextAreaState {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

const brackets = {
  "(": ")",
  "{": "}",
  "[": "]",
};

export default function CodeEditor(props: CodeEditorProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const currState = {
    lastKey: "",
  };

  const updateTextAreaState = (input: TextAreaState) => {
    const { value, selectionEnd, selectionStart } = input;

    if (!textAreaRef.current) {
      return;
    }

    textAreaRef.current.value = value;
    textAreaRef.current.selectionStart = selectionStart;
    textAreaRef.current.selectionEnd = selectionEnd;
  };

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { selectionStart, selectionEnd, value } = event.currentTarget;
    let text = value;
    const lastChar = text.charAt(selectionStart - 1);
    const isBracket = Object.keys(brackets).includes(lastChar);

    if (lastChar && isBracket && currState.lastKey !== "Backspace") {
      // add closing bracket
      text =
        text.substring(0, selectionStart) +
        brackets[lastChar as keyof typeof brackets] +
        text.substring(selectionStart);

      updateTextAreaState({
        value: text,
        selectionStart,
        selectionEnd,
      });
    }

    props.onValueChange(text);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const key = event.key;
    currState.lastKey = key;
    const { selectionStart, selectionEnd } = event.currentTarget;

    if (key === "Tab") {
      event.preventDefault();

      if (selectionStart === selectionEnd) {
        // insert tab
        const tabSize = props.tabSize ?? 2;
        const tabValue = " ".repeat(tabSize);
        const value =
          props.value.substring(0, selectionStart) +
          tabValue +
          props.value.substring(selectionEnd);
        const updatedSelectionValue = selectionStart + tabValue.length;
        updateTextAreaState({
          value,
          selectionStart: updatedSelectionValue,
          selectionEnd: updatedSelectionValue,
        });
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
