"use client";

import {
  CSSProperties,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";
import {
  Highlight,
  LineInputProps,
  LineOutputProps,
  Token,
  TokenInputProps,
  TokenOutputProps,
  themes,
} from "prism-react-renderer";

interface CodeEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  language: string;
  className?: string;
  tabSize?: number;
  // showLineNumbers?: boolean;
}

interface TextAreaState {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

interface EditorScreenProps {
  className: string;
  style: CSSProperties;
  tokens: Token[][];
  getLineProps: (input: LineInputProps) => LineOutputProps;
  getTokenProps: (input: TokenInputProps) => TokenOutputProps;
}

const brackets = {
  "(": ")",
  "{": "}",
  "[": "]",
};

export default function CodeEditor(props: CodeEditorProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // const [tokensLength, setTokensLength] = useState(0);
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

  const EditorScreen = ({
    className,
    style,
    tokens,
    getLineProps,
    getTokenProps,
  }: EditorScreenProps) => {
    // if (props.showLineNumbers) {
    //   setTokensLength(tokens.length);
    // }
    return (
      <pre
        style={{ ...style, ...styles.editor, ...styles.highlight }}
        className={className}
      >
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {/* {props.showLineNumbers && (
              <span className="pr-5 pl-3">{i + 1}</span>
            )} */}
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
    );
  };

  // const LineNumberBar = () => {
  //   const array = Array.from({ length: tokensLength }, (_, index) => index);
  //   return (
  //     <div className="">
  //       {array.map((num) => (
  //         <span className="pr-3 pl-3" style={styles.editor}>
  //           {num + 1}
  //         </span>
  //       ))}
  //     </div>
  //   );
  // };

  return (
    <div className={`${props.className}`}>
      <div className={`relative text-left box-border font-mono overflow-auto`}>
        <Highlight code={props.value} language={props.language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <EditorScreen
              className={className}
              style={style}
              tokens={tokens}
              getLineProps={getLineProps}
              getTokenProps={getTokenProps}
            />
          )}
        </Highlight>

        <div className="absolute top-0 left-0 h-full w-full flex">
          {/* {
            props.showLineNumbers && <LineNumberBar /> // invisible line number to match the orientation with the line numbers from EditorScreen
          } */}
          <textarea
            ref={textAreaRef}
            className="h-full w-full resize-none text-inherit overflow-auto antialiased text-white outline-none"
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
            autoFocus
          />
        </div>
      </div>
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
