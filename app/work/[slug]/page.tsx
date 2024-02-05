import { format, parseISO } from 'date-fns'
import { allWorks , Work  } from 'contentlayer/generated'
import { Mdx } from '@/components/mdx-components'

export const generateStaticParams = async () => allWorks.map((work) => ({ slug: work._raw.flattenedPath }))

const workLayout = ({ params }: { params: { slug: string } }) => {
  
  if (params.slug == "preload.js.map") return
  console.log(params.slug)
  console.log(allWorks.map((work) => work._raw.flattenedPath))
  const work = allWorks.find((work) => work._raw.flattenedPath === "work/"+params.slug)

  if (!work) return

  return (
    <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        <time dateTime={work.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(work.date), 'LLLL d, yyyy')}
        </time>
        <h1 className="text-3xl font-bold">{work.title}</h1>
      </div>
      <article className="py-6 prose dark:prose-invert">
        <Mdx code={work.body.code} />
      </article>
    </article>
  )
}

export default workLayout