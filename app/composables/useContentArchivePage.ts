import { uniqueCategories } from '~~/utils/content'
import { contentDateSortKeyNewestFirst } from '~~/utils/content-dates'

export async function useContentArchivePage(options: {
  asyncDataKey: string
  pathLike: '/blog/%' | '/notes/%'
}) {
  const route = useRoute()

  const { data: posts } = await useAsyncData(options.asyncDataKey, () =>
    queryCollection('content')
      .where('published', '=', true)
      .where('path', 'LIKE', options.pathLike)
      .order('date', 'DESC')
      .all(),
  )

  const categories = computed(() =>
    uniqueCategories(posts.value ?? []).filter((c): c is string => Boolean(c)),
  )

  const selectedCategory = computed(() => {
    const raw = route.query.category
    if (typeof raw !== 'string' || !raw.trim()) return null
    const decoded = decodeURIComponent(raw)
    return categories.value.includes(decoded) ? decoded : null
  })

  const sortedPosts = computed(() => {
    const list = posts.value ?? []
    return [...list].sort(
      (a, b) =>
        contentDateSortKeyNewestFirst(b.date) - contentDateSortKeyNewestFirst(a.date),
    )
  })

  const filteredPosts = computed(() => {
    const list = sortedPosts.value
    const cat = selectedCategory.value
    if (!cat) return list
    return list.filter((p) => p.category === cat)
  })

  return {
    posts,
    categories,
    selectedCategory,
    sortedPosts,
    filteredPosts,
  }
}
