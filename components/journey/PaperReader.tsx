"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GripHorizontal,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

// Served locally to avoid Next 14 transforming import.meta.url in the client bundle.
pdfjs.GlobalWorkerOptions.workerSrc = "/assets/journey/pdf.worker.min.mjs";

export type ResearchNormalizedRect = {
  page?: number | null;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ResearchRawRect = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  pageNumber?: number;
};

export type ResearchRect = ResearchNormalizedRect | ResearchRawRect;

export type ResearchPosition = {
  page?: number | null;
  boundingRect?: ResearchRect;
  rects?: ResearchRect[];
};

export type ResearchComment =
  | string
  | {
      content?: string;
      html?: string;
      text?: string;
      replies?: ResearchComment[];
    };

export type ResearchAnnotationContent =
  | string
  | {
      text?: string;
      image?: string;
      url?: string;
    };

export type ResearchAnnotation = {
  id: string;
  type?: string;
  color?: string;
  content?: ResearchAnnotationContent;
  position: ResearchPosition;
  comments?: ResearchComment[];
};

export type PaperReaderLabels = {
  back: string;
  notes: string;
  analysis: string;
  openAnalysis: string;
  closeAnalysis: string;
  resizeAnalysis: string;
  page: string;
  loadError: string;
  source: string;
};

export type PaperReaderProps = {
  title: string;
  pdfUrl: string;
  annotations: ResearchAnnotation[];
  backHref: string;
  labels: PaperReaderLabels;
  analysis?: ReactNode;
  year?: string | number;
  sourceUrl?: string;
};

type PositionedAnnotation = {
  annotation: ResearchAnnotation;
  rects: ResearchRect[];
  page: number;
};

type FloatingAnnotation = PositionedAnnotation & {
  side: "left" | "right";
  top: number;
  height: number;
};

type PanelTab = "analysis" | "notes";

const HIGHLIGHT_FALLBACK = "#86efac";
const MIN_ZOOM = 0.75;
const MAX_ZOOM = 1.35;
const CALLOUT_WIDTH = 256;
const CALLOUT_GAP = 12;

function numberOr(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function isNormalizedRect(rect: ResearchRect): rect is ResearchNormalizedRect {
  return "x" in rect && "y" in rect;
}

function pageOfRect(rect: ResearchRect) {
  return Math.max(
    1,
    Math.round(
      numberOr(isNormalizedRect(rect) ? rect.page : rect.pageNumber, 1),
    ),
  );
}

function pageOf(annotation: ResearchAnnotation) {
  const rect =
    annotation.position.boundingRect ?? annotation.position.rects?.[0];
  return Math.max(
    1,
    Math.round(numberOr(annotation.position.page, rect ? pageOfRect(rect) : 1)),
  );
}

function rectForPage(annotation: ResearchAnnotation, pageNumber: number) {
  const rects = annotation.position.rects?.length
    ? annotation.position.rects
    : annotation.position.boundingRect
      ? [annotation.position.boundingRect]
      : [];

  return rects.filter((rect) => pageOfRect(rect) === pageNumber);
}

function scaleRect(rect: ResearchRect) {
  if (isNormalizedRect(rect)) {
    return {
      height: `${Math.max(0, rect.height * 100)}%`,
      left: `${rect.x * 100}%`,
      top: `${rect.y * 100}%`,
      width: `${Math.max(0, rect.width * 100)}%`,
    };
  }

  const pageWidth = numberOr(rect.width, 1);
  const pageHeight = numberOr(rect.height, 1);

  return {
    height: `${Math.max(0, ((rect.y2 - rect.y1) / pageHeight) * 100)}%`,
    left: `${(rect.x1 / pageWidth) * 100}%`,
    top: `${(rect.y1 / pageHeight) * 100}%`,
    width: `${Math.max(0, ((rect.x2 - rect.x1) / pageWidth) * 100)}%`,
  };
}

function topOfRect(rect: ResearchRect) {
  return isNormalizedRect(rect) ? rect.y : rect.y1 / numberOr(rect.height, 1);
}

function centerOfRect(rect: ResearchRect) {
  return isNormalizedRect(rect)
    ? rect.x + rect.width / 2
    : (rect.x1 + rect.x2) / 2 / numberOr(rect.width, 1);
}

function horizontalEdgeOfRect(rect: ResearchRect, side: "left" | "right") {
  if (isNormalizedRect(rect)) {
    return side === "left" ? rect.x : rect.x + rect.width;
  }

  return (side === "left" ? rect.x1 : rect.x2) / numberOr(rect.width, 1);
}

function verticalCenterOfRect(rect: ResearchRect) {
  if (isNormalizedRect(rect)) return rect.y + rect.height / 2;
  return (rect.y1 + rect.y2) / 2 / numberOr(rect.height, 1);
}

function plainText(value: string | undefined) {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function annotationText(annotation: ResearchAnnotation) {
  if (typeof annotation.content === "string") return annotation.content;
  return annotation.content?.text ?? "";
}

function commentText(comment: ResearchComment) {
  if (typeof comment === "string") return comment;
  return comment.text ?? comment.content ?? plainText(comment.html);
}

function commentTexts(comments: ResearchComment[]) {
  const flattened: string[] = [];
  const visit = (comment: ResearchComment) => {
    const text = commentText(comment);
    if (text) flattened.push(text);
    if (typeof comment !== "string") comment.replies?.forEach(visit);
  };
  comments.forEach(visit);
  return flattened;
}

function colorWithOpacity(color: string, opacity: string) {
  if (!/^#[\da-f]{6}$/i.test(color)) return color;
  return `${color}${opacity}`;
}

function calloutText(annotation: ResearchAnnotation) {
  const comments = commentTexts(annotation.comments ?? []);
  return comments.join(" ") || annotationText(annotation);
}

function estimatedCalloutHeight(annotation: ResearchAnnotation) {
  const text = calloutText(annotation);
  const lines = Math.min(4, Math.max(1, Math.ceil(text.length / 30)));
  const hasComment = commentTexts(annotation.comments ?? []).length > 0;
  return 56 + lines * 23 + (hasComment && annotationText(annotation) ? 56 : 0);
}

function layoutFloatingAnnotations(
  entries: PositionedAnnotation[],
  pageHeight: number,
) {
  const nextSlot = { left: 12, right: 12 };

  return [...entries]
    .sort((a, b) => topOfRect(a.rects[0]) - topOfRect(b.rects[0]))
    .map((entry): FloatingAnnotation => {
      const anchor = entry.rects[0];
      const desiredTop = topOfRect(anchor) * pageHeight;
      const preferredSide = centerOfRect(anchor) < 0.5 ? "left" : "right";
      const alternateSide = preferredSide === "left" ? "right" : "left";
      const side =
        desiredTop < nextSlot[preferredSide] &&
        nextSlot[alternateSide] < nextSlot[preferredSide]
          ? alternateSide
          : preferredSide;
      const height = estimatedCalloutHeight(entry.annotation);
      const top = Math.max(12, desiredTop - 18, nextSlot[side]);
      nextSlot[side] = top + height + CALLOUT_GAP;

      return { ...entry, side, top, height };
    });
}

function FloatingAnnotationCard({
  entry,
  selected,
  labels,
  onSelect,
  compact = false,
}: {
  entry: FloatingAnnotation | PositionedAnnotation;
  selected: boolean;
  labels: PaperReaderLabels;
  onSelect: () => void;
  compact?: boolean;
}) {
  const comments = commentTexts(entry.annotation.comments ?? []);
  const quote = annotationText(entry.annotation);
  const text = comments.join(" ") || quote;
  const color = entry.annotation.color || HIGHLIGHT_FALLBACK;

  return (
    <button
      aria-pressed={selected}
      className={`${compact ? "w-[min(18rem,82vw)] shrink-0" : "w-64"} rounded-xl border bg-background p-3 text-left shadow-[0_12px_36px_rgba(0,0,0,0.2)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected ${selected ? "border-selected" : "border-border hover:border-muted"}`}
      onClick={onSelect}
      type="button"
    >
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
        <span
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        {labels.notes} · {labels.page} {entry.page}
      </span>
      <span className="mt-2 line-clamp-4 block text-sm leading-relaxed text-primary">
        {text}
      </span>
      {comments.length && quote ? (
        <span className="mt-2 line-clamp-2 block border-t border-border pt-2 font-serif text-xs leading-relaxed text-muted">
          “{quote}”
        </span>
      ) : null}
    </button>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled = false,
  pressed,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={pressed}
      className={`bg-background/90 inline-flex size-9 shrink-0 items-center justify-center rounded-full border text-primary backdrop-blur-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected disabled:cursor-not-allowed disabled:opacity-35 ${pressed ? "border-selected" : "border-border hover:border-muted"}`}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

export function PaperReader({
  title,
  pdfUrl,
  annotations,
  backHref,
  labels,
  analysis,
  year,
  sourceUrl,
}: PaperReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef(new Map<number, HTMLDivElement>());
  const analysisPanelRef = useRef<HTMLElement>(null);
  const panelDragRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const panelResizeRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [viewerWidth, setViewerWidth] = useState(900);
  const [zoom, setZoom] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<PanelTab>("analysis");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const element = viewerRef.current;
    if (!element) return;

    const updateWidth = () => setViewerWidth(element.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!pageCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const nextPage = Number(
          (visible?.target as HTMLElement | undefined)?.dataset.page,
        );
        if (nextPage) setPageNumber(nextPage);
      },
      { rootMargin: "-20% 0px -45%", threshold: [0, 0.15, 0.35, 0.6] },
    );

    pageRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pageCount]);

  useEffect(() => {
    if (!panelOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [panelOpen]);

  const positionedAnnotations = useMemo(() => {
    const byPage = new Map<number, PositionedAnnotation[]>();

    for (const annotation of annotations) {
      const page = pageOf(annotation);
      const rects = rectForPage(annotation, page);
      const anchor = annotation.position.boundingRect;
      const entry = {
        annotation,
        page,
        rects: rects.length ? rects : anchor ? [anchor] : [],
      };
      if (!entry.rects.length) continue;
      byPage.set(page, [...(byPage.get(page) ?? []), entry]);
    }

    return byPage;
  }, [annotations]);

  const annotationsOnPage = positionedAnnotations.get(pageNumber) ?? [];
  const panelAnnotations = useMemo(
    () =>
      Array.from(positionedAnnotations.values())
        .flat()
        .sort(
          (a, b) =>
            a.page - b.page || topOfRect(a.rects[0]) - topOfRect(b.rects[0]),
        ),
    [positionedAnnotations],
  );
  const selectedAnnotationOnPage = annotationsOnPage.find(
    ({ annotation }) => annotation.id === selectedId,
  );
  const showSideAnnotations = viewerWidth >= 1280;
  const pageWidth = Math.max(
    280,
    Math.floor(
      Math.min(
        760,
        Math.max(320, viewerWidth - (showSideAnnotations ? 680 : 40)),
      ) * zoom,
    ),
  );

  const scrollToPage = useCallback((nextPage: number) => {
    pageRefs.current.get(nextPage)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const selectAnnotation = useCallback(
    (annotation: ResearchAnnotation) => {
      const nextPage = pageOf(annotation);
      setSelectedId((current) =>
        current === annotation.id ? null : annotation.id,
      );
      if (nextPage !== pageNumber) scrollToPage(nextPage);
    },
    [pageNumber, scrollToPage],
  );

  const changePage = useCallback(
    (nextPage: number) => {
      scrollToPage(Math.min(Math.max(1, nextPage), pageCount || 1));
    },
    [pageCount, scrollToPage],
  );

  const startPanelDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (
        window.innerWidth < 640 ||
        (event.target as HTMLElement).closest("button, a")
      ) {
        return;
      }

      const panel = analysisPanelRef.current;
      if (!panel) return;
      const bounds = panel.getBoundingClientRect();
      panelDragRef.current = {
        pointerId: event.pointerId,
        offsetX: event.clientX - bounds.left,
        offsetY: event.clientY - bounds.top,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  const movePanel = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = panelDragRef.current;
    const panel = analysisPanelRef.current;
    if (!drag || !panel || drag.pointerId !== event.pointerId) return;

    const left = Math.min(
      Math.max(8, event.clientX - drag.offsetX),
      Math.max(8, window.innerWidth - panel.offsetWidth - 8),
    );
    const top = Math.min(
      Math.max(64, event.clientY - drag.offsetY),
      Math.max(64, window.innerHeight - panel.offsetHeight - 8),
    );

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  }, []);

  const stopPanelDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (panelDragRef.current?.pointerId !== event.pointerId) return;
      panelDragRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    },
    [],
  );

  const startPanelResize = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const panel = analysisPanelRef.current;
      if (!panel) return;
      const bounds = panel.getBoundingClientRect();
      panelResizeRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: bounds.width,
        startHeight: bounds.height,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    },
    [],
  );

  const resizePanel = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const resize = panelResizeRef.current;
      const panel = analysisPanelRef.current;
      if (!resize || !panel || resize.pointerId !== event.pointerId) return;
      const bounds = panel.getBoundingClientRect();
      const width = Math.min(
        Math.max(240, resize.startWidth + event.clientX - resize.startX),
        window.innerWidth - bounds.left - 8,
      );
      const height = Math.min(
        Math.max(220, resize.startHeight + event.clientY - resize.startY),
        window.innerHeight - bounds.top - 8,
      );
      panel.style.width = `${width}px`;
      panel.style.height = `${height}px`;
    },
    [],
  );

  const stopPanelResize = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (panelResizeRef.current?.pointerId !== event.pointerId) return;
      panelResizeRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    },
    [],
  );

  return (
    <section
      aria-label={`${title} paper`}
      className="min-h-screen bg-background text-primary"
    >
      <header className="bg-background/90 sm:px-5 fixed inset-x-0 top-0 z-40 border-b border-border px-3 py-2 backdrop-blur-xl">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <Link
            aria-label={labels.back}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors hover:border-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected"
            href={backHref}
            title={labels.back}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>

          <div className="min-w-0 text-center">
            <p className="truncate text-sm tracking-[-0.02em]">{title}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted">
              {year ? `${year} · ` : ""}
              {pageCount
                ? `${labels.page} ${pageNumber} / ${pageCount}`
                : `${labels.page} —`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {sourceUrl ? (
              <a
                aria-label={labels.source}
                className="sm:inline-flex hidden size-9 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors hover:border-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selected"
                href={sourceUrl}
                rel="noreferrer"
                target="_blank"
                title={labels.source}
              >
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            ) : null}
            <IconButton
              label={labels.openAnalysis}
              onClick={() => setPanelOpen((open) => !open)}
              pressed={panelOpen}
            >
              <BookOpen className="size-4" aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </header>

      <div
        ref={viewerRef}
        className="sm:px-6 sm:pt-28 overflow-x-auto px-3 pb-28 pt-24"
      >
        {loadError ? (
          <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center border border-dashed border-border p-8 text-center text-sm leading-6 text-muted">
            {loadError}
          </div>
        ) : (
          <Document
            file={pdfUrl}
            loading={
              <div className="flex min-h-[70vh] items-center justify-center text-sm text-muted">
                {labels.page}…
              </div>
            }
            onLoadError={() => setLoadError(labels.loadError)}
            onLoadSuccess={({ numPages }) => {
              setPageCount(numPages);
              setPageNumber((current) => Math.min(current, numPages));
            }}
          >
            <div className="sm:gap-16 flex min-w-fit flex-col items-center gap-10">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (page) => {
                  const pageAnnotations = positionedAnnotations.get(page) ?? [];
                  const pageHeight = pageWidth * (792 / 612);
                  const floatingAnnotations = layoutFloatingAnnotations(
                    pageAnnotations,
                    pageHeight,
                  );
                  const sideRail = showSideAnnotations ? CALLOUT_WIDTH + 48 : 0;
                  const stageWidth = pageWidth + sideRail * 2;
                  const stageHeight = Math.max(
                    pageHeight,
                    ...floatingAnnotations.map(
                      (entry) => entry.top + entry.height + CALLOUT_GAP,
                    ),
                  );

                  return (
                    <div
                      className="relative scroll-mt-24"
                      data-page={page}
                      key={page}
                      ref={(element) => {
                        if (element) pageRefs.current.set(page, element);
                        else pageRefs.current.delete(page);
                      }}
                      style={{ minHeight: stageHeight, width: stageWidth }}
                    >
                      <div className="journey-pdf-page relative mx-auto w-fit overflow-visible bg-white shadow-[0_16px_48px_rgba(0,0,0,0.16)]">
                        <Page
                          pageNumber={page}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          width={pageWidth}
                        />
                        <div
                          aria-label={`${labels.notes} · ${labels.page} ${page}`}
                          className="pointer-events-none absolute inset-0 z-10"
                        >
                          {pageAnnotations.flatMap(({ annotation, rects }) =>
                            rects.map((rect, index) => {
                              const selected = annotation.id === selectedId;
                              const color =
                                annotation.color || HIGHLIGHT_FALLBACK;

                              return (
                                <button
                                  aria-label={`${labels.notes}: ${annotationText(annotation) || labels.notes}`}
                                  className="pointer-events-auto absolute cursor-pointer rounded-[2px] transition-[box-shadow,background-color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-selected"
                                  key={`${annotation.id}-${index}`}
                                  onClick={() => selectAnnotation(annotation)}
                                  style={{
                                    ...scaleRect(rect),
                                    backgroundColor: colorWithOpacity(
                                      color,
                                      selected ? "82" : "58",
                                    ),
                                    boxShadow: selected
                                      ? `0 0 0 1px ${color}`
                                      : undefined,
                                  }}
                                  type="button"
                                />
                              );
                            }),
                          )}
                        </div>
                      </div>

                      {showSideAnnotations ? (
                        <svg
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 z-[15] overflow-visible"
                          height={stageHeight}
                          viewBox={`0 0 ${stageWidth} ${stageHeight}`}
                          width={stageWidth}
                        >
                          {floatingAnnotations.map((entry) => {
                            const anchor = entry.rects[0];
                            const color =
                              entry.annotation.color || HIGHLIGHT_FALLBACK;
                            const fromX =
                              entry.side === "left"
                                ? CALLOUT_WIDTH
                                : stageWidth - CALLOUT_WIDTH;
                            const fromY = entry.top + 20;
                            const elbowX =
                              entry.side === "left"
                                ? sideRail - 16
                                : sideRail + pageWidth + 16;
                            const targetX =
                              sideRail +
                              horizontalEdgeOfRect(anchor, entry.side) *
                                pageWidth;
                            const targetY =
                              verticalCenterOfRect(anchor) * pageHeight;

                            return (
                              <g key={`connector-${entry.annotation.id}`}>
                                <polyline
                                  fill="none"
                                  points={`${fromX},${fromY} ${elbowX},${fromY} ${targetX},${targetY}`}
                                  stroke={color}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.25"
                                />
                                <circle
                                  cx={targetX}
                                  cy={targetY}
                                  fill={color}
                                  r="2.5"
                                />
                              </g>
                            );
                          })}
                        </svg>
                      ) : null}

                      {showSideAnnotations
                        ? floatingAnnotations.map((entry) => (
                            <div
                              className="absolute z-20"
                              key={`callout-${entry.annotation.id}`}
                              style={
                                entry.side === "left"
                                  ? { left: 0, top: entry.top }
                                  : { right: 0, top: entry.top }
                              }
                            >
                              <FloatingAnnotationCard
                                entry={entry}
                                labels={labels}
                                onSelect={() =>
                                  selectAnnotation(entry.annotation)
                                }
                                selected={entry.annotation.id === selectedId}
                              />
                            </div>
                          ))
                        : null}
                    </div>
                  );
                },
              )}
            </div>
          </Document>
        )}
      </div>

      {!showSideAnnotations && selectedAnnotationOnPage ? (
        <div className="pointer-events-none fixed inset-x-3 bottom-[5.25rem] z-30 flex justify-center">
          <div className="pointer-events-auto">
            <FloatingAnnotationCard
              compact
              entry={selectedAnnotationOnPage}
              labels={labels}
              onSelect={() => setSelectedId(null)}
              selected
            />
          </div>
        </div>
      ) : null}

      {panelOpen ? (
        <aside
          aria-label={`${labels.analysis} · ${labels.notes}`}
          aria-modal="false"
          className="journey-analysis-panel z-50 flex flex-col overflow-hidden rounded-[14px] border border-border bg-background"
          ref={analysisPanelRef}
          role="dialog"
        >
          <div
            className="sm:cursor-move flex touch-none select-none items-center justify-between gap-2 border-b border-border p-1.5"
            onPointerCancel={stopPanelDrag}
            onPointerDown={startPanelDrag}
            onPointerMove={movePanel}
            onPointerUp={stopPanelDrag}
          >
            <div
              aria-label={`${labels.analysis} · ${labels.notes}`}
              className="flex min-w-0 items-center gap-0.5"
              role="tablist"
            >
              {(
                [
                  ["analysis", labels.analysis],
                  ["notes", labels.notes],
                ] as const
              ).map(([tab, label]) => (
                <button
                  aria-controls={`journey-panel-${tab}`}
                  aria-selected={panelTab === tab}
                  className={`truncate rounded-md px-2 py-1 text-xs transition-[background-color,color,opacity] duration-100 ${panelTab === tab ? "bg-primary/[0.07] text-primary" : "hover:bg-primary/[0.035] text-muted hover:text-primary"}`}
                  id={`journey-tab-${tab}`}
                  key={tab}
                  onClick={() => setPanelTab(tab)}
                  role="tab"
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <GripHorizontal
                aria-hidden="true"
                className="sm:block hidden size-4 text-muted"
              />
              <button
                aria-label={labels.closeAnalysis}
                className="hover:bg-primary/[0.05] flex size-7 items-center justify-center rounded-md text-muted transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-selected"
                onClick={() => setPanelOpen(false)}
                title={labels.closeAnalysis}
                type="button"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {panelTab === "analysis" ? (
              <div
                aria-labelledby="journey-tab-analysis"
                className="journey-analysis p-3"
                id="journey-panel-analysis"
                role="tabpanel"
              >
                {analysis}
              </div>
            ) : (
              <div
                aria-labelledby="journey-tab-notes"
                className="flex flex-col"
                id="journey-panel-notes"
                role="tabpanel"
              >
                {panelAnnotations.map((entry) => {
                  const comments = commentTexts(
                    entry.annotation.comments ?? [],
                  );
                  const quote = annotationText(entry.annotation);
                  const text = comments.join(" ") || quote;
                  const color = entry.annotation.color || HIGHLIGHT_FALLBACK;
                  const selected = entry.annotation.id === selectedId;

                  return (
                    <button
                      aria-pressed={selected}
                      className={`border-b border-border p-3 text-left transition-colors last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-selected ${selected ? "bg-primary/[0.055]" : "hover:bg-primary/[0.03]"}`}
                      key={entry.annotation.id}
                      onClick={() => selectAnnotation(entry.annotation)}
                      type="button"
                    >
                      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        <span
                          aria-hidden="true"
                          className="size-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {labels.page} {entry.page}
                      </span>
                      <span className="mt-2 block text-[13px] leading-normal text-primary">
                        {text}
                      </span>
                      {comments.length && quote ? (
                        <span className="mt-2 line-clamp-2 block border-t border-border pt-2 font-serif text-xs leading-relaxed text-muted">
                          “{quote}”
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button
            aria-label={labels.resizeAnalysis}
            className="sm:flex hidden h-7 w-full shrink-0 cursor-nwse-resize touch-none items-center justify-end gap-2 border-t border-border px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted"
            onPointerCancel={stopPanelResize}
            onPointerDown={startPanelResize}
            onPointerMove={resizePanel}
            onPointerUp={stopPanelResize}
            title={labels.resizeAnalysis}
            type="button"
          >
            <span>{labels.resizeAnalysis}</span>
            <span className="size-2.5 border-b border-r border-muted" />
          </button>
        </aside>
      ) : null}

      {!loadError ? (
        <div className="bg-background/90 fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border p-1.5 shadow-lg backdrop-blur-xl">
          <IconButton
            disabled={pageNumber <= 1}
            label={`${labels.page} ${Math.max(1, pageNumber - 1)}`}
            onClick={() => changePage(pageNumber - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </IconButton>
          <span className="min-w-16 text-center font-mono text-[10px] tabular-nums text-muted">
            {pageNumber} / {pageCount || "—"}
          </span>
          <IconButton
            disabled={!pageCount || pageNumber >= pageCount}
            label={`${labels.page} ${pageNumber + 1}`}
            onClick={() => changePage(pageNumber + 1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </IconButton>
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
          <IconButton
            disabled={zoom <= MIN_ZOOM}
            label="Zoom out"
            onClick={() => setZoom((value) => Math.max(MIN_ZOOM, value - 0.1))}
          >
            <Minus className="size-3.5" aria-hidden="true" />
          </IconButton>
          <span className="sm:block hidden min-w-10 text-center font-mono text-[10px] tabular-nums text-muted">
            {Math.round(zoom * 100)}%
          </span>
          <IconButton
            disabled={zoom >= MAX_ZOOM}
            label="Zoom in"
            onClick={() => setZoom((value) => Math.min(MAX_ZOOM, value + 0.1))}
          >
            <Plus className="size-3.5" aria-hidden="true" />
          </IconButton>
        </div>
      ) : null}
    </section>
  );
}

export default PaperReader;
