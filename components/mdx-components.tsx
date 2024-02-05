import { useMDXComponent } from "next-contentlayer/hooks"
import Image, { ImageProps } from 'next/image'

const components = {
  Image : (props: ImageProps) => <Image {...props} />,
}

interface MdxProps {
  code: string
}


export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code)
  return <Component components={components} />
}