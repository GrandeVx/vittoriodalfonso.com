"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import ComingSoon from "@/public/ComingSoon.webp";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  fallbackSrc = ComingSoon.src,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}