import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const contentRoot = path.join(process.cwd(), "markdown");
const locales = ["en", "it"] as const;

const dateSchema = z
  .union([z.string(), z.date()])
  .transform((value) =>
    value instanceof Date
      ? value.toISOString().slice(0, 10)
      : value.slice(0, 10),
  );

const baseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  language: z.enum(locales),
  date: dateSchema,
});

const portfolioSchema = baseSchema.extend({
  cover: z.string().min(1),
  attributes: z.string().optional(),
  redirect: z.string().optional(),
  comingSoon: z.boolean().optional().default(false),
  comingSoonDark: z.boolean().optional().default(false),
  refer: z.string().optional(),
});

const journeySchema = baseSchema
  .extend({
    kind: z
      .enum(["paper", "note", "experiment", "article"])
      .optional(),
    order: z.number().int().optional().default(0),
    abstract: z.string().optional(),
    authors: z.array(z.string()).optional().default([]),
    paperYear: z.number().int().optional(),
    // Kept as a read fallback while older Journey files are migrated.
    year: z.number().int().optional(),
    sourceId: z.string().optional(),
    pdf: z.string().optional(),
    annotations: z.string().optional(),
    sourceUrl: z.string().optional(),
  })
  .transform((value) => ({
    ...value,
    kind: value.kind ?? (value.pdf ? "paper" : "article"),
    paperYear: value.paperYear ?? value.year,
  }));

type Collection = "work" | "project" | "journey";

type ContentIdentity = {
  _id: string;
  slug: string;
  url: string;
  body: string;
};

export type Work = z.infer<typeof portfolioSchema> & ContentIdentity;
export type Project = z.infer<typeof portfolioSchema> & ContentIdentity;
export type Journey = z.infer<typeof journeySchema> & ContentIdentity;

function readCollection<T>(
  collection: Collection,
  schema: z.ZodType<T>,
): Array<T & ContentIdentity> {
  return locales.flatMap((locale) => {
    const directory = path.join(contentRoot, collection, locale);

    return readdirSync(directory)
      .filter((filename) => filename.endsWith(".mdx"))
      .map((filename) => {
        const slug = filename.replace(/\.mdx$/, "");
        const relativePath = `${collection}/${locale}/${filename}`;
        const source = readFileSync(path.join(directory, filename), "utf8");
        const { data, content } = matter(source);
        const parsed = schema.safeParse(data);

        if (!parsed.success) {
          throw new Error(
            `Invalid frontmatter in markdown/${relativePath}: ${z.prettifyError(parsed.error)}`,
          );
        }

        return {
          ...parsed.data,
          _id: relativePath,
          slug,
          url: `/${locale}/${collection}/${slug}`,
          body: content.trim(),
        };
      });
  });
}

export function getWorks(): Work[] {
  return readCollection("work", portfolioSchema);
}

export function getProjects(): Project[] {
  return readCollection("project", portfolioSchema);
}

export function getJourneys(): Journey[] {
  return readCollection("journey", journeySchema);
}

export function getWork(language: string, slug: string): Work | undefined {
  return getWorks().find(
    (work) => work.language === language && work.slug === slug,
  );
}

export function getProject(
  language: string,
  slug: string,
): Project | undefined {
  return getProjects().find(
    (project) => project.language === language && project.slug === slug,
  );
}

export function getJourney(
  language: string,
  slug: string,
): Journey | undefined {
  return getJourneys().find(
    (journey) => journey.language === language && journey.slug === slug,
  );
}
