import tagsData from '~/data/tags.json'

export const useSeoTag = () => {
  const { getCanonicalUrl, getOgImageMeta, generateBreadcrumbJsonLd, generateCollectionPageJsonLd } = useSeo()

  const getAllTags = () => tagsData

  const getTagData = (tagSlug) => tagsData.find(t => t.slug === tagSlug) || null

  const generateTagTitle = (tagSlug) => {
    const tag = getTagData(tagSlug)
    return tag?.title || 'Сервера Lineage 2 | L2GM'
  }

  const generateTagH1 = (tagSlug) => {
    const tag = getTagData(tagSlug)
    return tag?.h1 || 'Сервера Lineage 2'
  }

  const generateTagDescription = (tagSlug) => {
    const tag = getTagData(tagSlug)
    return tag?.description || 'Анонсы серверов Lineage 2 на L2GM.'
  }

  const generateTagKeywords = (tagSlug) => {
    const tag = getTagData(tagSlug)
    return tag?.keywords || 'сервера lineage 2, lineage 2, l2, л2, сервера л2'
  }

  const generateTagSeoText = (tagSlug) => {
    const tag = getTagData(tagSlug)
    return tag?.seoText || ''
  }

  const generateTagSeoTitle = (tagSlug) => {
    const tag = getTagData(tagSlug)
    return tag?.seoTitle || 'Сервера Lineage 2'
  }

  const getTagFilter = (tagSlug) => {
    const tag = getTagData(tagSlug)
    return tag?.filter || null
  }

  const getTagEmptyMessage = (tagSlug) => {
    const tag = getTagData(tagSlug)
    return tag?.emptyMessage || 'Сервера не найдены'
  }

  const generateTagFullMeta = (tagSlug) => {
    const title = generateTagTitle(tagSlug)
    const description = generateTagDescription(tagSlug)
    const keywords = generateTagKeywords(tagSlug)
    const canonicalUrl = getCanonicalUrl(`/${tagSlug}/`)

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'L2GM' },
        ...getOgImageMeta(),
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ]
    }
  }

  return {
    getAllTags,
    getTagData,
    generateTagTitle,
    generateTagH1,
    generateTagDescription,
    generateTagKeywords,
    generateTagSeoText,
    generateTagSeoTitle,
    getTagFilter,
    getTagEmptyMessage,
    generateTagFullMeta,
    generateBreadcrumbJsonLd,
    generateCollectionPageJsonLd,
  }
}
