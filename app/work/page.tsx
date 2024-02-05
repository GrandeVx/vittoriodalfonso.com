import Link from 'next/link'
import { compareDesc, format, parseISO } from 'date-fns'
import { allWorks , Work  } from 'contentlayer/generated'
import { Mdx } from "@/components/mdx-components"
function WorkCard(work: Work) {
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link href={work.url} className="text-blue-700 hover:text-blue-900 dark:text-blue-400">
          {work.title}
        </Link>
      </h2>
      <time dateTime={work.date} className="mb-2 block text-xs text-gray-600">
        {format(parseISO(work.date), 'LLLL d, yyyy')}
      </time>
      <article className="py-6 prose dark:prose-invert">
      <Mdx code={work.body.code} /> 
      </article>
    </div>
  )
}

export default function Home() {
  const works = allWorks.sort((a : any, b : any) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-2xl font-black">Next.js + Contentlayer Example</h1>
      {works.map((work : any, idx : any) => (
        <WorkCard key={idx} {...work} />
      ))}
    </div>
  )
}