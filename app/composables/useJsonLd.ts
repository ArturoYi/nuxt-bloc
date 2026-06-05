type JsonLdSchema = Record<string, unknown>

export function useJsonLd(
  key: string,
  schema: MaybeRefOrGetter<JsonLdSchema | null | undefined>,
) {
  useHead(() => {
    const value = toValue(schema)
    if (!value) {
      return {}
    }

    return {
      script: [
        {
          key,
          type: 'application/ld+json',
          innerHTML: JSON.stringify(value),
        },
      ],
    }
  })
}
