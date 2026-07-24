/** 解析内容 front matter 中的 date 字段；无效或缺失时返回 null。 */
export function parseContentDateTimestamp(date?: string | null): number | null {
  if (!date) return null
  const t = Date.parse(date)
  return Number.isFinite(t) ? t : null
}

/** 按日期从新到旧排序时，缺失日期沉底。 */
export function contentDateSortKeyNewestFirst(date?: string | null): number {
  return parseContentDateTimestamp(date) ?? Number.NEGATIVE_INFINITY
}

/** 按日期从旧到新排序时，缺失日期沉底。 */
export function contentDateSortKeyOldestFirst(date?: string | null): number {
  return parseContentDateTimestamp(date) ?? Number.POSITIVE_INFINITY
}

export function yearFromContentDate(date?: string | null): number | null {
  const t = parseContentDateTimestamp(date)
  if (t === null) return null
  const y = new Date(t).getFullYear()
  return Number.isFinite(y) ? y : null
}
