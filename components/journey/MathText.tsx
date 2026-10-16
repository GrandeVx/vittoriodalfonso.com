import katex from "katex";
import "katex/dist/katex.min.css";

const mathPattern =
  /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g;

export default function MathText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const pattern = new RegExp(mathPattern);
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(
        <span className="whitespace-pre-wrap" key={`text-${lastIndex}`}>
          {text.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const formula = match[1] ?? match[2] ?? match[3] ?? match[4];
    const displayMode = match[1] !== undefined || match[3] !== undefined;
    parts.push(
      <span
        className={
          displayMode
            ? "my-2 block max-w-full overflow-x-auto overflow-y-hidden py-1"
            : "inline-block max-w-full overflow-x-auto align-baseline"
        }
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(formula.trim(), {
            displayMode,
            throwOnError: false,
            trust: false,
            maxExpand: 200,
          }),
        }}
        key={`math-${match.index}`}
      />,
    );
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span className="whitespace-pre-wrap" key={`text-${lastIndex}`}>
        {text.slice(lastIndex)}
      </span>,
    );
  }

  return <>{parts}</>;
}
