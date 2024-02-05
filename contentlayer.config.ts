import { defineDocumentType, makeSource } from 'contentlayer/source-files'

const Work = defineDocumentType(() => ({
  name: 'Work',
  filePathPattern: `work/**/*.mdx`,
  contentType: 'mdx', 
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (work) => `${work._raw.flattenedPath}` },
  },
}))

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (post : any) => `/posts/${post._raw.flattenedPath}` },
  },
}))

export default makeSource({
  contentDirPath: "markdown",
  documentTypes: [Post, Work],
})

