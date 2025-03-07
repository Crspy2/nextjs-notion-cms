import ky from 'ky'
import lqip from 'lqip-modern'
import {type ExtendedRecordMap, type PreviewImage, type PreviewImageMap} from 'notion-types'
import {getPageImageUrls, normalizeUrl} from 'notion-utils'
import pMap from 'p-map'
import pMemoize from 'p-memoize'

import {defaultPageCover, defaultPageIcon} from './config'
import {mapImageUrl} from './map-image-url'

export async function getPreviewImageMap(
  recordMap: ExtendedRecordMap
): Promise<PreviewImageMap> {
  const urls: string[] = (getPageImageUrls(recordMap, {
    mapImageUrl
  }) || "")
    .concat([defaultPageIcon || "", defaultPageCover?.toString() || ""])
    .filter(Boolean)

  return Object.fromEntries(
      await pMap(
          urls,
          async (url) => {
            const cacheKey = normalizeUrl(url)
            return [cacheKey, await getPreviewImage(url, {cacheKey})]
          },
          {
            concurrency: 8
          }
      )
  )
}

async function createPreviewImage(
  url: string,
  { cacheKey }: { cacheKey: string }
): Promise<PreviewImage | null> {
  try {
    const body = await ky(url).arrayBuffer()
    const result = await lqip(body)
    console.log('lqip', { ...result.metadata, url, cacheKey })

    return {
      originalWidth: result.metadata.originalWidth,
      originalHeight: result.metadata.originalHeight,
      dataURIBase64: result.metadata.dataURIBase64
    }
  } catch (err: unknown) {
    console.warn('failed to create preview image', url, (err as Error).message)
    return null
  }
}

export const getPreviewImage = pMemoize(createPreviewImage)
