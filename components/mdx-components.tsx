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
    <article className="prose pb-16 dark:prose-invert prose-h1:text-sm prose-h6:text-[13px] prose-h6:text-gray-400 prose-p:text-pretty prose-p:text-sm prose-p:text-black prose-table:flex prose-table:w-full prose-table:justify-evenly dark:prose-p:text-white dark:prose-p:antialiased md:pb-8">
      <Component components={components} />
    </article>
  );
}
