import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
        image: z.string(),
        date: z.string(),
        slug: z.string(),
        faq: z
          .array(
            z.object({
              q: z.string(),
              a: z.string(),
            })
          )
          .optional(),
      }),
    }),
  },
})
