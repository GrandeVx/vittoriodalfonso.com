import { MDXRemote } from "next-mdx-remote/rsc";
import Image, { type ImageProps } from "next/image";

type ContentImageProps = Omit<ImageProps, "width" | "height"> & {
  width: number | string;
  height: number | string;
  note?: string;
};

function ContentImage({ width, height, note, alt, ...props }: ContentImageProps) {
  void note;
  return (
    <Image {...props} alt={alt} width={Number(width)} height={Number(height)} />
  );
}

const components = {
  Image: ContentImage,
};

interface MdxProps {
  source: string;
}

export function Mdx({ source }: MdxProps) {
  return (
    <article className="prose pb-16 dark:prose-invert prose-h1:text-sm prose-h3:text-[13px] prose-h3:font-normal prose-h3:text-muted prose-p:text-pretty prose-p:text-sm prose-p:text-primary prose-ul:text-sm prose-li:text-sm prose-li:text-primary prose-table:flex prose-table:w-full prose-table:justify-evenly dark:prose-p:text-white dark:prose-li:text-white dark:prose-p:antialiased md:pb-8">
      <MDXRemote source={source} components={components} />
    </article>
  );
}
