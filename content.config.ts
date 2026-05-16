import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        published: z.boolean().default(true),
        date: z.string().optional(),
        category: z.string().optional(),
        series: z.string().optional(),
        stage: z.string().optional(),
        tags: z.array(z.string()).default([]),
        cover: z.string().optional(),
        image: z.string().optional(),
        location: z.string().optional(),
        camera: z.string().optional(),
        shotAt: z.string().optional(),
        aspect: z.string().optional(),
        featured: z.boolean().default(false),
        rawbody: z.string(),
        type: z.string(),
        children: z.any(),
      }),
      indexes: [
        { columns: ['path'], unique: true },
        { columns: ['date'] },
        { columns: ['published'] },
        { columns: ['series'] },
        { columns: ['stage'] },
      ],
    }),
  },
})
