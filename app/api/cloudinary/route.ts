import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const dynamic = 'force-dynamic'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CloudinaryImage {
  public_id: string
  url: string
  secure_url: string
  created_at: string
  width: number
  height: number
  format: string
  bytes: number
}

interface ProcessedImage {
  public_id: string
  url: string
  created_at: string
  width: number
  height: number
  format: string
  aspect_ratio: number
}

const YEARS_CONFIG = [
  { year: 2023, folder: 'cascaiscup/2023' },
  { year: 2024, folder: 'cascaiscup/2024' },
  { year: 2025, folder: 'cascaiscup/2025' }
] as const

const DEFAULT_IMAGES_PER_YEAR = 6
const MAX_IMAGES_PER_YEAR = 1000
const API_TIMEOUT = 8000

function processImage(image: CloudinaryImage): ProcessedImage {
  return {
    public_id: image.public_id,
    url: image.secure_url || image.url,
    created_at: image.created_at,
    width: image.width,
    height: image.height,
    format: image.format,
    aspect_ratio: image.width / image.height
  }
}

async function fetchImagesFromFolder(
  folder: string,
  maxResults: number = DEFAULT_IMAGES_PER_YEAR,
  offset: number = 0
): Promise<ProcessedImage[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const fetchLimit = Math.min(maxResults + offset, MAX_IMAGES_PER_YEAR)

    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('created_at', 'desc')
      .max_results(fetchLimit)
      .with_field('context')
      .execute()

    clearTimeout(timeoutId)

    const allImages = (result.resources || []).map(processImage)
    return allImages.slice(offset, offset + maxResults)
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout for folder: ${folder}`)
    }

    throw new Error(
      `Failed to fetch from ${folder}: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

async function batchFetchAllYears(
  maxPerYear: number = DEFAULT_IMAGES_PER_YEAR
) {
  const promises = YEARS_CONFIG.map(async config => {
    try {
      const images = await fetchImagesFromFolder(config.folder, maxPerYear)
      return {
        year: config.year,
        folder: config.folder,
        images,
        count: images.length,
        success: true,
        error: null as string | null
      }
    } catch (error) {
      console.error(`Error fetching ${config.year}:`, error)
      return {
        year: config.year,
        folder: config.folder,
        images: [] as ProcessedImage[],
        count: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  const results = await Promise.all(promises)

  const imagesByYear: Record<number, ProcessedImage[]> = {}
  const errors: string[] = []
  let totalImages = 0

  results.forEach(result => {
    imagesByYear[result.year] = result.images
    totalImages += result.count
    if (!result.success && result.error) {
      errors.push(`${result.year}: ${result.error}`)
    }
  })

  return { imagesByYear, errors, totalImages }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { searchParams } = new URL(request.url)

    const folder = searchParams.get('folder')
    const maxResults = parseInt(
      searchParams.get('max') || String(DEFAULT_IMAGES_PER_YEAR)
    )
    const offset = parseInt(searchParams.get('offset') || '0')

    if (folder) {
      const images = await fetchImagesFromFolder(folder, maxResults, offset)
      return NextResponse.json({
        success: true,
        images,
        count: images.length,
        folder,
        offset,
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      })
    }

    const maxPerYear = parseInt(
      searchParams.get('maxPerYear') || String(DEFAULT_IMAGES_PER_YEAR)
    )
    const { imagesByYear, errors, totalImages } =
      await batchFetchAllYears(maxPerYear)

    return NextResponse.json(
      {
        success: true,
        imagesByYear,
        totalImages,
        availableYears: YEARS_CONFIG.map(c => c.year),
        errors: errors.length > 0 ? errors : null,
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300',
          'CDN-Cache-Control': 'public, max-age=300',
          'Vercel-CDN-Cache-Control': 'public, max-age=300'
        }
      }
    )
  } catch (error) {
    console.error('Cloudinary API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch gallery images',
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      }
    )
  }
}

export async function HEAD() {
  try {
    await cloudinary.api.ping()
    return new Response(null, { status: 200 })
  } catch {
    return new Response(null, { status: 503 })
  }
}
