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
  variant?: "article" | "analysis";
}

const articleStyles =
  "prose pb-16 dark:prose-invert prose-h1:text-sm prose-h3:text-[13px] prose-h3:font-normal prose-h3:text-muted prose-p:text-pretty prose-p:text-sm prose-p:text-primary prose-ul:text-sm prose-li:text-sm prose-li:text-primary prose-table:flex prose-table:w-full prose-table:justify-evenly dark:prose-p:text-white dark:prose-li:text-white dark:prose-p:antialiased md:pb-8";

const analysisStyles =
  "prose max-w-none pb-2 dark:prose-invert prose-headings:text-primary prose-h3:mb-2 prose-h3:mt-6 prose-h3:text-sm prose-h3:font-medium prose-p:my-3 prose-p:text-pretty prose-p:text-[15px] prose-p:leading-7 prose-p:text-primary prose-strong:font-medium prose-strong:text-primary prose-ul:my-3 prose-ul:text-[15px] prose-li:my-1 prose-li:leading-6 prose-li:text-primary dark:prose-p:text-white dark:prose-li:text-white";

export function Mdx({ source, variant = "article" }: MdxProps) {
  return (
    <article className={variant === "analysis" ? analysisStyles : articleStyles}>
      <MDXRemote source={source} components={components} />
    </article>
  );
}
