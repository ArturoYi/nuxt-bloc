import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { buildItemListJsonLd } from '~~/utils/content-archive'

type ArchiveJsonLdItem = {
  name: string
  path: string
}

export function useArchiveItemListJsonLd(
  key: string,
  items: MaybeRefOrGetter<readonly ArchiveJsonLdItem[]>,
) {
  const runtimeConfig = useRuntimeConfig()

  const schema = computed(() =>
    buildItemListJsonLd(
      runtimeConfig.public.siteUrl,
      toValue(items),
    ),
  )

  useJsonLd(key, schema)
}
