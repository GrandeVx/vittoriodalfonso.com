"use client";

import dynamic from "next/dynamic";
import type { PaperReaderProps } from "@/components/journey/PaperReader";

const PaperReader = dynamic<PaperReaderProps>(
  () => import("@/components/journey/PaperReader"),
  {
    ssr: false,
    loading: () => (
      <main className="min-h-screen bg-background" aria-busy="true" />
    ),
  },
);

export default function PaperReaderClient(props: PaperReaderProps) {
  return <PaperReader {...props} />;
}
