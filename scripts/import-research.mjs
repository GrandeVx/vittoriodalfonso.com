#!/usr/bin/env node

/**
 * Read-only export of the first four items in Research's "The Journey" category.
 *
 * Usage:
 *   node scripts/import-research.mjs
 *   node scripts/import-research.mjs --db /path/to/data.db --research-root /path/to/Research
 */
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { homedir } from 'node:os'
import process from 'node:process'

const projectRoot = process.cwd()
const userHome = homedir()
const defaultDb = join(userHome, 'Library/Application Support/research.un.ms/data.db')
const defaultResearchRoot = join(userHome, 'UNMS/Research')

function readOptions(argv) {
  const options = { db: defaultDb, researchRoot: defaultResearchRoot, hasExplicitDb: false }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === '--db' || value === '--research-root') {
      const optionValue = argv[index + 1]
      if (!optionValue || optionValue.startsWith('--')) {
        throw new Error(`Missing value for ${value}`)
      }
      if (value === '--db') {
        options.db = resolve(optionValue)
        options.hasExplicitDb = true
      } else {
        options.researchRoot = resolve(optionValue)
      }
      index += 1
      continue
    }
    if (value === '--help' || value === '-h') {
      console.log('Usage: node scripts/import-research.mjs [--db path] [--research-root path]')
      process.exit(0)
    }
    throw new Error(`Unknown option: ${value}`)
  }

  return options
}

function query(db, sql) {
  const result = execFileSync('sqlite3', ['-readonly', '-json', db, sql], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 16 * 1024 * 1024,
  })
  return result.trim() ? JSON.parse(result) : []
}

function parseJson(value, fallback) {
  if (typeof value !== 'string' || !value.trim()) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function slugify(title) {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[—–]/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function quoteYaml(value) {
  return JSON.stringify(value ?? '')
}

function safeUrl(value) {
  if (typeof value !== 'string' || !value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

function textFromRichText(value) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?(p|div|li|blockquote|pre|h[1-6])[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>(\n)?/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// The app only ever needs to render this sanitized field. Attribute-less tags
// preserve the author's basic emphasis without retaining executable HTML.
function sanitizeHtml(value) {
  if (typeof value !== 'string' || !/<[a-z!/]/i.test(value)) return null
  const allowed = new Set(['p', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'br'])
  const withoutUnsafeBlocks = value.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
  return withoutUnsafeBlocks.replace(/<\/?([a-z0-9-]+)(?:\s[^>]*)?>/gi, (match, tag) => {
    const normalizedTag = tag.toLowerCase()
    if (!allowed.has(normalizedTag)) return ''
    return match.startsWith('</') ? `</${normalizedTag}>` : `<${normalizedTag}>`
  })
}

function normalizedRect(rect) {
  if (!rect || typeof rect !== 'object') return null
  const width = Number(rect.width)
  const height = Number(rect.height)
  const x1 = Number(rect.x1)
  const y1 = Number(rect.y1)
  const x2 = Number(rect.x2)
  const y2 = Number(rect.y2)
  if (![width, height, x1, y1, x2, y2].every(Number.isFinite) || width <= 0 || height <= 0) {
    return null
  }
  return {
    page: Number.isFinite(Number(rect.pageNumber)) ? Number(rect.pageNumber) : null,
    x: x1 / width,
    y: y1 / height,
    width: (x2 - x1) / width,
    height: (y2 - y1) / height,
  }
}

function normalizeContent(content) {
  const value = parseJson(content, {})
  const text = typeof value.text === 'string' ? value.text : null
  const image = typeof value.image === 'string' && /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(value.image)
    ? value.image
    : null
  return { text, image }
}

function normalizeComment(comment) {
  const content = typeof comment.content === 'string' ? comment.content : ''
  return {
    id: comment.id,
    parentId: comment.parent_id ?? null,
    isAi: comment.is_ai === true || comment.is_ai === 1 || comment.is_ai === 'true',
    prompt: typeof comment.prompt === 'string' && comment.prompt.trim() ? comment.prompt.trim() : null,
    html: sanitizeHtml(content),
    text: textFromRichText(content),
    createdAt: comment.created_at ?? null,
    updatedAt: comment.updated_at ?? null,
  }
}

function makeThreads(comments) {
  const nodes = new Map(comments.map((comment) => [comment.id, { ...comment, replies: [] }]))
  const roots = []
  for (const comment of nodes.values()) {
    const parent = comment.parentId ? nodes.get(comment.parentId) : null
    if (parent) parent.replies.push(comment)
    else roots.push(comment)
  }
  return roots
}

function selectedText(annotation) {
  const content = normalizeContent(annotation.content)
  return content.text || (content.image ? 'Image annotation' : '')
}

function markdownBody(item, annotations, comments, language, existingMemo = '') {
  const description = item.abstract?.trim() || 'Imported from Research.'
  const notes = annotations.flatMap((annotation) => {
    const annotationComments = comments.filter((comment) => comment.annotation_id === annotation.id)
    return annotationComments.map((comment) => ({
      quote: selectedText(annotation),
      prompt: comment.prompt,
      text: textFromRichText(comment.content),
      page: normalizedRect(parseJson(annotation.position, {}).boundingRect)?.page,
    }))
  }).filter((note) => note.text)

  const fallbackMemo = language === 'it'
    ? `## Perché è importante\n\n${description}\n\n## Appunti di lettura\n\nLe note seguenti sono importate da Research e restano collegate alle coordinate del PDF nel file delle annotazioni.`
    : `## Why it matters\n\n${description}\n\n## Reading notes\n\nThe notes below are imported from Research. Their original Italian wording remains linked to PDF coordinates in the annotations payload.`
  const notesHeading = language === 'it'
    ? '## Appunti di lettura\n\nLe note seguenti sono importate da Research e restano collegate alle coordinate del PDF nel file delle annotazioni.'
    : '## Reading notes\n\nThe notes below are imported from Research. Their original Italian wording remains linked to PDF coordinates in the annotations payload.'
  const intro = existingMemo ? `${existingMemo}\n\n${notesHeading}` : fallbackMemo
  const notesMarkdown = notes.length
    ? notes.map((note) => {
      const prompt = note.prompt ? `**${note.prompt}**\n\n` : ''
      const quote = note.quote ? `> ${note.quote.replace(/\n/g, '\n> ')}\n\n` : ''
      const noteTitle = language === 'it' ? 'Nota' : 'Note'
      const pageLabel = note.page ? (language === 'it' ? ` · pagina ${note.page}` : ` · page ${note.page}`) : ''
      return `### ${noteTitle}${pageLabel}\n\n${quote}${prompt}${note.text}`
    }).join('\n\n')
    : language === 'it'
      ? 'Nessun commento importato per questo paper.'
      : 'No comments were imported for this paper.'
  const source = safeUrl(item.link)
  return `${intro}\n\n${notesMarkdown}${source ? `\n\n## Fonte\n\n[Paper originale](${source})` : ''}\n`
}

function makeMdx(item, authors, slug, order, language, annotations, comments, existingMemo) {
  const date = (item.date || item.created_at || '').slice(0, 10)
  const description = item.abstract?.trim() || 'Imported from Research.'
  const frontmatter = [
    '---',
    `title: ${quoteYaml(item.title)}`,
    `description: ${quoteYaml(description)}`,
    `abstract: ${quoteYaml(description)}`,
    'kind: "paper"',
    ...(Number.isFinite(Number(item.year)) ? [`paperYear: ${Number(item.year)}`] : []),
    `sourceId: ${quoteYaml(item.id)}`,
    `pdf: ${quoteYaml(`/journey/papers/${slug}.pdf`)}`,
    `annotations: ${quoteYaml(`/journey/data/${slug}.json`)}`,
    `sourceUrl: ${quoteYaml(safeUrl(item.link) || '')}`,
    `language: ${quoteYaml(language)}`,
    `date: ${quoteYaml(date)}`,
    `order: ${order}`,
    `authors: ${JSON.stringify(authors)}`,
    '---',
    '',
  ].join('\n')
  return frontmatter + markdownBody(item, annotations, comments, language, existingMemo)
}

async function fileExists(path) {
  try {
    await access(path, constants.R_OK)
    return true
  } catch {
    return false
  }
}

async function readExistingMemo(filePath, language) {
  if (!(await fileExists(filePath))) return ''

  const source = await readFile(filePath, 'utf8')
  const frontmatterEnd = source.indexOf('\n---\n', 4)
  if (frontmatterEnd < 0) return ''

  const body = source.slice(frontmatterEnd + 5).trim()
  const notesHeading = language === 'it' ? '## Appunti di lettura' : '## Reading notes'
  const notesIndex = body.indexOf(`\n${notesHeading}`)
  return (notesIndex < 0 ? body : body.slice(0, notesIndex)).trim()
}

async function main() {
  const { db, researchRoot, hasExplicitDb } = readOptions(process.argv.slice(2))
  const databaseCandidates = hasExplicitDb ? [db] : [db, join(dirname(db), 'data.sqlite')]
  const database = (await Promise.all(databaseCandidates.map(async (candidate) => ((await fileExists(candidate)) ? candidate : null))))
    .find(Boolean)
  if (!database) throw new Error(`Research database not found. Checked: ${databaseCandidates.join(', ')}`)

  const items = query(database, `
    SELECT id, title, year, date, link, doi, abstract, ai_summary, created_at
    FROM items
    WHERE category_id = (SELECT id FROM categories WHERE name = 'The Journey' LIMIT 1)
    ORDER BY id
    LIMIT 4
  `)
  if (items.length !== 4) {
    throw new Error(`Expected at least four items in The Journey; found ${items.length}.`)
  }

  const ids = items.map((item) => `'${item.id.replace(/'/g, "''")}'`).join(', ')
  const attachments = query(database, `
    SELECT id, item_id, file_path, url, type, title
    FROM attachments
    WHERE item_id IN (${ids})
    ORDER BY item_id, id
  `)
  const annotations = query(database, `
    SELECT id, item_id, type, comment, content, position, color, created_at, updated_at
    FROM annotations
    WHERE item_id IN (${ids})
    ORDER BY item_id, id
  `)
  const comments = query(database, `
    SELECT id, is_ai, parent_id, annotation_id, prompt, content, created_at, updated_at
    FROM comments
    WHERE annotation_id IN (SELECT id FROM annotations WHERE item_id IN (${ids}))
    ORDER BY annotation_id, created_at, id
  `)
  const authorRows = query(database, `
    SELECT ia.item_id, au.first_name, au.last_name
    FROM items_authors ia
    JOIN authors au ON au.id = ia.author_id
    WHERE ia.item_id IN (${ids})
    ORDER BY ia.item_id, au.last_name, au.first_name
  `)

  await Promise.all([
    mkdir(join(projectRoot, 'public/journey/papers'), { recursive: true }),
    mkdir(join(projectRoot, 'public/journey/data'), { recursive: true }),
    mkdir(join(projectRoot, 'markdown/journey/it'), { recursive: true }),
    mkdir(join(projectRoot, 'markdown/journey/en'), { recursive: true }),
  ])

  for (const [index, item] of items.entries()) {
    const slug = slugify(item.title)
    const itemAnnotations = annotations.filter((annotation) => annotation.item_id === item.id)
    const itemComments = comments.filter((comment) => itemAnnotations.some((annotation) => annotation.id === comment.annotation_id))
    const attachment = attachments.find((candidate) => candidate.item_id === item.id && candidate.type === 'application/pdf')
    if (!attachment) throw new Error(`No PDF attachment found for ${item.title}`)

    const attachmentPath = attachment.file_path || join(researchRoot, 'items', item.id, basename(attachment.url || 'document.pdf'))
    if (!(await fileExists(attachmentPath))) {
      throw new Error(`PDF attachment not found for ${item.title}: ${attachmentPath}`)
    }
    const authors = authorRows
      .filter((author) => author.item_id === item.id)
      .map((author) => [author.first_name, author.last_name].filter(Boolean).join(' ').trim())
      .filter((author) => author && author.toLowerCase() !== 'unknown')
    const italianMdxPath = join(projectRoot, 'markdown/journey/it', `${slug}.mdx`)
    const englishMdxPath = join(projectRoot, 'markdown/journey/en', `${slug}.mdx`)
    const [italianMemo, englishMemo] = await Promise.all([
      readExistingMemo(italianMdxPath, 'it'),
      readExistingMemo(englishMdxPath, 'en'),
    ])

    const machineAnnotations = itemAnnotations.map((annotation) => {
      const position = parseJson(annotation.position, {})
      const normalizedComments = itemComments
        .filter((comment) => comment.annotation_id === annotation.id)
        .map(normalizeComment)
      return {
        id: annotation.id,
        type: annotation.type || 'highlight',
        color: annotation.color || null,
        content: normalizeContent(annotation.content),
        position: {
          page: normalizedRect(position.boundingRect)?.page ?? null,
          boundingRect: normalizedRect(position.boundingRect),
          rects: Array.isArray(position.rects) ? position.rects.map(normalizedRect).filter(Boolean) : [],
        },
        comments: makeThreads(normalizedComments),
        commentCount: normalizedComments.length,
        createdAt: annotation.created_at ?? null,
        updatedAt: annotation.updated_at ?? null,
      }
    })
    const payload = {
      version: 1,
      source: 'Research',
      sourceId: item.id,
      title: item.title,
      pdf: `/journey/papers/${slug}.pdf`,
      annotationCount: machineAnnotations.length,
      commentCount: machineAnnotations.reduce((total, annotation) => total + annotation.commentCount, 0),
      annotations: machineAnnotations,
    }

    await Promise.all([
      copyFile(attachmentPath, join(projectRoot, 'public/journey/papers', `${slug}.pdf`)),
      writeFile(join(projectRoot, 'public/journey/data', `${slug}.json`), `${JSON.stringify(payload, null, 2)}\n`),
      writeFile(italianMdxPath, makeMdx(item, authors, slug, index + 1, 'it', itemAnnotations, itemComments, italianMemo)),
      writeFile(englishMdxPath, makeMdx(item, authors, slug, index + 1, 'en', itemAnnotations, itemComments, englishMemo)),
    ])
    console.log(`${String(index + 1).padStart(2, '0')} ${slug}: ${machineAnnotations.length} annotations, ${payload.commentCount} comments`)
  }
}

main().catch((error) => {
  console.error(`Research import failed: ${error.message}`)
  process.exitCode = 1
})
