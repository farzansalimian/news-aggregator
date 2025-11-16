import { stripHtml as stripHtmlFn } from 'string-strip-html'

export const stripHtml = (html: string) => {
  return stripHtmlFn(html).result
}
