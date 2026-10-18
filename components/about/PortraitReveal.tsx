"use client";

import Image, { type StaticImageData } from "next/image";
import { useState, type PointerEvent } from "react";

type PortraitRevealProps = {
  src: StaticImageData;
  description: string;
  revealLabel: string;
  priority?: boolean;
};

export default function PortraitReveal({
  src,
  description,
  revealLabel,
  priority = false,
}: PortraitRevealProps) {
  const [isActive, setIsActive] = useState(false);

  function setOrigin(event: PointerEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(
      100,
      Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100),
    );
    const y = Math.min(
      100,
      Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100),
    );
    event.currentTarget.style.setProperty("--splash-x", `${x}%`);
    event.currentTarget.style.setProperty("--splash-y", `${y}%`);
  }

  return (
    <button
      type="button"
      aria-label={`${revealLabel}: ${description}`}
      aria-pressed={isActive}
      data-active={isActive}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") {
          setOrigin(event);
          setIsActive(true);
        }
      }}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") {
          setOrigin(event);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") {
          setOrigin(event);
          setIsActive(false);
        }
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) setIsActive(true);
      }}
      onBlur={() => setIsActive(false)}
      onClick={() => {
        if (window.matchMedia("(hover: none)").matches) {
          setIsActive((active) => !active);
        }
      }}
      className="about-portrait relative block aspect-[3/4] w-1/2 min-w-0 overflow-hidden bg-surface p-0 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-selected"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 1280px) 250px, (min-width: 768px) 50vw, 50vw"
        loading="eager"
        fetchPriority={priority ? "high" : "auto"}
        className="object-cover grayscale"
      />
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 1280px) 250px, (min-width: 768px) 50vw, 50vw"
        loading="eager"
        aria-hidden="true"
        className="about-portrait-color object-cover"
      />
    </button>
  );
}
