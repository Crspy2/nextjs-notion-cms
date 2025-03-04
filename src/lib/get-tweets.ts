import {type ExtendedRecordMap} from 'notion-types'
import {getPageTweetIds} from 'notion-utils'
import pMap from 'p-map'
import pMemoize from 'p-memoize'
import {getTweet as getTweetData} from 'react-tweet/api'

import type {ExtendedTweetRecordMap} from './types'

export async function getTweetsMap(
  recordMap: ExtendedRecordMap
): Promise<void> {
  const tweetIds = getPageTweetIds(recordMap)

  ;(recordMap as ExtendedTweetRecordMap).tweets  = Object.fromEntries(
    await pMap(
      tweetIds,
      async (tweetId: string) => {
        return [tweetId, await getTweet(tweetId)]
      },
      {
        concurrency: 8
      }
    )
  )
}

async function getTweetImpl(tweetId: string): Promise<unknown> {
  if (!tweetId) return null

  try {
    return (await getTweetData(tweetId)) || null
  } catch (err: unknown) {
    console.warn('failed to get tweet', tweetId, (err as Error).message)
    return null
  }
}

export const getTweet = pMemoize(getTweetImpl)
