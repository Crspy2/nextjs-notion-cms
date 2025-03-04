import { NextRequest, NextResponse } from "next/server"
import { search } from '@/lib/notion'
import type { SearchParams } from "notion-types"

export const POST = async (req: NextRequest) => {
  const searchParams = convertToNotionSearchParams(req)

  console.log('<<< lambda search-notion', searchParams)
  const results = await search(searchParams)
  console.log('>>> lambda search-notion', results)

  const headers = new Headers()
  headers.append(
      'Cache-Control',
      'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  return new NextResponse(JSON.stringify(results), { headers })
}

const convertToNotionSearchParams = (req: NextRequest): SearchParams => {
  const searchParams = req.nextUrl.searchParams;

  // Basic required fields with default values if not present
  const result: SearchParams = {
    ancestorId: searchParams.get('ancestorId') || '', // Required field, empty string as fallback
    query: searchParams.get('query') || '' // Required field, empty string as fallback
  };

  // Optional filters object
  const filters = {
    isDeletedOnly: searchParams.get('isDeletedOnly') === 'true',
    excludeTemplates: searchParams.get('excludeTemplates') === 'true',
    isNavigableOnly: searchParams.get('isNavigableOnly') === 'true',
    requireEditPermissions: searchParams.get('requireEditPermissions') === 'true'
  };

  // Only add filters object if at least one filter is explicitly set
  if (Object.values(filters).some(val => val !== false)) {
    result.filters = filters;
  }

  // Optional limit - convert string to number if present
  const limit = searchParams.get('limit');
  if (limit !== null) {
    result.limit = parseInt(limit, 10);
  }

  // Optional searchSessionId
  const searchSessionId = searchParams.get('searchSessionId');
  if (searchSessionId !== null) {
    result.searchSessionId = searchSessionId;
  }

  return result;
}