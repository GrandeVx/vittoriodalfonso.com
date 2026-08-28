import { ImageResponse } from "next/og";
import {
  findJourney,
  type JourneyKind,
  type JourneyParams,
} from "@/lib/journey";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: Promise<JourneyParams>;
};

function formatPublicationDate(date: string, language: string) {
  return new Intl.DateTimeFormat(language === "it" ? "it-IT" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

function formatKind(kind: JourneyKind, language: string) {
  const labels = {
    paper: language === "it" ? "Paper annotato" : "Annotated paper",
    note: language === "it" ? "Nota" : "Note",
    experiment: language === "it" ? "Esperimento" : "Experiment",
    article: language === "it" ? "Approfondimento" : "Article",
  };

  return labels[kind];
}

function truncate(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export default async function OpenGraphImage({ params }: Props) {
  const resolvedParams = await params;
  const journey = findJourney(resolvedParams);
  const publicationDate = journey
    ? formatPublicationDate(journey.date, resolvedParams.lang)
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#f7f7f7",
          color: "#0f0f0f",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "64px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            The Journey
          </div>
          <div
            style={{
              color: "#a2a2a2",
              display: "flex",
              fontSize: 20,
            }}
          >
            Vittorio D&apos;Alfonso
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#ff8444",
              display: "flex",
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {journey
              ? formatKind(journey.kind, resolvedParams.lang)
              : "The Journey"}
          </div>
          <div
            style={{
              display: "flex",
              fontSize:
                journey && journey.title.length > 92
                  ? 44
                  : journey && journey.title.length > 72
                    ? 52
                    : 62,
              fontWeight: 600,
              letterSpacing: "-0.045em",
              lineHeight: 1.02,
              maxWidth: "1000px",
            }}
          >
            {journey?.title ?? "Journey entry not found"}
          </div>
          {journey ? (
            <div
              style={{
                color: "#555555",
                display: "flex",
                fontSize: 24,
                lineHeight: 1.35,
                maxWidth: "920px",
              }}
            >
              {truncate(journey.description, 220)}
            </div>
          ) : null}
        </div>

        <div
          style={{
            alignItems: "center",
            borderTop: "1px solid #d8d8d8",
            color: "#555555",
            display: "flex",
            fontSize: 20,
            justifyContent: "space-between",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex" }}>
            {resolvedParams.lang === "it" ? "Pubblicato" : "Published"}{" "}
            {publicationDate}
          </div>
          <div style={{ display: "flex" }}>
            {journey?.kind === "paper" && journey.paperYear
              ? `Paper · ${journey.paperYear}`
              : "vittoriodalfonso.com"}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
