import { useMDXComponent } from "next-contentlayer/hooks";
import Image, { ImageProps } from "next/image";
const components = {
  Image: (props: ImageProps) => <Image {...props} />,
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  return (
    <article className="prose pb-16 dark:prose-invert prose-h1:text-sm prose-h3:text-[13px] prose-h3:font-normal prose-h3:text-muted prose-p:text-pretty prose-p:text-sm prose-p:text-primary prose-ul:text-sm prose-li:text-sm prose-li:text-primary prose-table:flex prose-table:w-full prose-table:justify-evenly dark:prose-p:text-white dark:prose-li:text-white dark:prose-p:antialiased md:pb-8">
      <Component components={components} />
    </article>
  );
}
