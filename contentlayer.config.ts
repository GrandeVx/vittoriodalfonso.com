import { defineDocumentType, makeSource } from "contentlayer/source-files";

const Work = defineDocumentType(() => ({
  name: "Work",
  filePathPattern: `work/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    attributes: { type: "string", required: false },
    redirect: { type: "string", required: false },
    date: { type: "date", required: true },
    cover: { type: "string", required: true },
    language: { type: "string", required: true },
  },
  computedFields: {
    url: { type: "string", resolve: (work) => `${work._raw.flattenedPath}` },
  },
}));

const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `project/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    attributes: { type: "string", required: false },
    redirect: { type: "string", required: false },
    date: { type: "date", required: true },
    cover: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `${post._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "markdown",
  documentTypes: [Project, Work],
});
