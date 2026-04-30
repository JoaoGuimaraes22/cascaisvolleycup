"use client";

import { useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import { FiGrid, FiList, FiRefreshCw, FiPlus, FiX } from "react-icons/fi";

import OptimizedCloudinaryImage from "./optimized-cloudinary-image";
import type { ProcessedImage } from "../../_hooks/use-optimized-gallery";

// Grid size configurations
type GridSize = "small" | "medium" | "large";

interface GridDimensions {
  small: { width: number; height: number; cols: string };
  medium: { width: number; height: number; cols: string };
  large: { width: number; height: number; cols: string };
}

const dimensions: GridDimensions = {
  small: {
    width: 300,
    height: 225,
    cols: "grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  },
  medium: {
    width: 400,
    height: 300,
    cols: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  },
  large: {
    width: 600,
    height: 450,
    cols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  },
};

const IMAGES_PER_LOAD = 30;

type GalleryMainDict = {
  loading: string;
  failed_title: string;
  try_again: string;
  image: string;
  images: string;
  more_available: string;
  all_loaded: string;
  load_more: string;
  loading_more: string;
  grid_size: string;
  grid_sizes: {
    small: string;
    medium: string;
    large: string;
  };
  gallery_image: string;
  close_lightbox: string;
};

interface OptimizedGalleryProps {
  folder?: string;
  year?: number;
  title?: string;
  description?: string;
  dict: GalleryMainDict;
}

type GalleryState = {
  key: string;
  fetchNonce: number;
  images: ProcessedImage[];
  offset: number;
  hasMore: boolean;
  error: string | null;
  loaded: boolean;
  loadingMore: boolean;
};

const initialGalleryState = (key: string, fetchNonce = 0): GalleryState => ({
  key,
  fetchNonce,
  images: [],
  offset: 0,
  hasMore: true,
  error: null,
  loaded: false,
  loadingMore: false,
});

function buildGalleryUrl(offset: number, year?: number, folder?: string) {
  let url = `/api/cloudinary?max=${IMAGES_PER_LOAD}&offset=${offset}`;
  if (folder) url += `&folder=${folder}`;
  else if (year) url += `&folder=cascaiscup/${year}`;
  return url;
}

async function fetchGalleryPage(
  offset: number,
  year?: number,
  folder?: string
): Promise<ProcessedImage[]> {
  const response = await fetch(buildGalleryUrl(offset, year, folder));
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch images");
  }
  return result.images || [];
}

function useProgressiveGallery(year?: number, folder?: string) {
  const requestKey = JSON.stringify({ year: year ?? null, folder: folder ?? null });
  const [state, setState] = useState<GalleryState>(() =>
    initialGalleryState(requestKey)
  );

  if (state.key !== requestKey) {
    setState(initialGalleryState(requestKey));
  }

  const loading = state.key !== requestKey || (!state.loaded && !state.error);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const newImages = await fetchGalleryPage(0, year, folder);
        if (cancelled) return;
        setState((prev) =>
          prev.key === requestKey && prev.fetchNonce === state.fetchNonce
            ? {
                ...prev,
                images: newImages,
                offset: IMAGES_PER_LOAD,
                hasMore: newImages.length === IMAGES_PER_LOAD,
                loaded: true,
                error: null,
              }
            : prev
        );
      } catch (err) {
        if (cancelled) return;
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("Gallery fetch error:", err);
        setState((prev) =>
          prev.key === requestKey && prev.fetchNonce === state.fetchNonce
            ? { ...prev, loaded: true, error: errorMessage }
            : prev
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [requestKey, state.fetchNonce, year, folder]);

  const loadMore = useCallback(async () => {
    if (loading || state.loadingMore || !state.hasMore) return;
    setState((prev) => ({ ...prev, loadingMore: true, error: null }));
    try {
      const newImages = await fetchGalleryPage(state.offset, year, folder);
      setState((prev) =>
        prev.key === requestKey
          ? {
              ...prev,
              images: [...prev.images, ...newImages],
              offset: prev.offset + IMAGES_PER_LOAD,
              hasMore: newImages.length === IMAGES_PER_LOAD,
              loadingMore: false,
            }
          : prev
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";
      console.error("Gallery fetch error:", err);
      setState((prev) =>
        prev.key === requestKey
          ? { ...prev, loadingMore: false, error: errorMessage }
          : prev
      );
    }
  }, [
    loading,
    state.loadingMore,
    state.hasMore,
    state.offset,
    requestKey,
    year,
    folder,
  ]);

  const refresh = useCallback(() => {
    setState((prev) => initialGalleryState(prev.key, prev.fetchNonce + 1));
  }, []);

  return {
    images: state.images,
    loading,
    loadingMore: state.loadingMore,
    error: state.error,
    hasMore: state.hasMore,
    loadMore,
    refresh,
    totalLoaded: state.images.length,
  };
}

// Individual image item component
function GalleryImageItem({
  image,
  index,
  size,
  onImageClick,
}: {
  image: ProcessedImage;
  index: number;
  size: GridSize;
  onImageClick?: (image: ProcessedImage) => void;
}) {
  return (
    <div
      className={clsx(
        "group relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 motion-safe:transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/25 hover:ring-2 hover:ring-sky-300",
        onImageClick && "cursor-pointer"
      )}
      onClick={() => onImageClick?.(image)}
    >
      {image ? (
        <OptimizedCloudinaryImage
          publicId={image.public_id}
          alt={`Gallery image ${index + 1}`}
          width={dimensions[size].width}
          height={dimensions[size].height}
          quality={70}
          className="h-full w-full object-cover motion-safe:transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${
            100 / (size === "small" ? 5 : size === "medium" ? 4 : 3)
          }vw`}
        />
      ) : (
        <div className="h-full w-full motion-safe:animate-pulse bg-slate-200" />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 motion-safe:transition-opacity duration-300 group-hover:opacity-100" />

      {/* Image info on hover */}
      <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 motion-safe:transition-opacity duration-300 group-hover:opacity-100">
        <p className="truncate text-xs">
          {image.format?.toUpperCase()} • {image.width} × {image.height}
        </p>
      </div>
    </div>
  );
}

// Load More button component interface
interface LoadMoreButtonProps {
  onLoadMore: () => void;
  loading: boolean;
  hasMore: boolean;
  totalLoaded: number;
  allLoadedText: string;
  loadMoreText: string;
  loadingMoreText: string;
  imageText: string;
  imagesText: string;
}

function LoadMoreButton({
  onLoadMore,
  loading,
  hasMore,
  totalLoaded,
  allLoadedText,
  loadMoreText,
  loadingMoreText,
  imageText,
  imagesText,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="py-8 text-center">
        <p className="text-slate-600">
          {allLoadedText} ({totalLoaded}{" "}
          {totalLoaded === 1 ? imageText : imagesText})
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className={clsx(
          "inline-flex items-center gap-3 rounded-full px-8 py-4 font-medium motion-safe:transition-all duration-200",
          "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg",
          "hover:-translate-y-0.5 hover:from-sky-600 hover:to-blue-700 hover:shadow-xl",
          "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
          "disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {loading ? (
          <>
            <div className="h-5 w-5 motion-safe:animate-spin rounded-full border-2 border-white border-t-transparent" />
            {loadingMoreText}
          </>
        ) : (
          <>
            <FiPlus className="h-5 w-5" />
            {loadMoreText}
          </>
        )}
      </button>
    </div>
  );
}

export default function Gallery({
  folder,
  year,
  title,
  description,
  dict,
}: OptimizedGalleryProps) {
  // Gallery state
  const [gridSize, setGridSize] = useState<GridSize>("medium");
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(
    null
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Use progressive loading hook
  const {
    images,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    totalLoaded,
  } = useProgressiveGallery(year, folder);

  // Lightbox handlers
  const openLightbox = useCallback((image: ProcessedImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setSelectedImage(null);
  }, []);

  // Grid size options
  const gridSizeOptions: { value: GridSize; icon: typeof FiGrid; label: string }[] = [
    { value: "small", icon: FiGrid, label: dict.grid_sizes.small },
    { value: "medium", icon: FiGrid, label: dict.grid_sizes.medium },
    { value: "large", icon: FiList, label: dict.grid_sizes.large },
  ];

  if (loading && images.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 motion-safe:animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="mt-4 text-slate-600">{dict.loading}</p>
        </div>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FiRefreshCw className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            {dict.failed_title}
          </h3>
          <p className="mb-4 text-slate-600">{error}</p>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
          >
            <FiRefreshCw className="h-4 w-4" />
            {dict.try_again}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && (
            <h1 className="mb-4 text-3xl font-bold text-slate-900">{title}</h1>
          )}
          {description && (
            <p className="mx-auto max-w-2xl text-slate-600">{description}</p>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">
            {totalLoaded} {totalLoaded === 1 ? dict.image : dict.images}
            {hasMore && ` (${dict.more_available})`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">{dict.grid_size}:</span>
          {gridSizeOptions.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setGridSize(value)}
              className={clsx(
                "rounded-lg p-2 text-sm motion-safe:transition-colors",
                gridSize === value
                  ? "bg-sky-500 text-white"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              )}
              title={label}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className={clsx("grid gap-4", dimensions[gridSize].cols)}>
        {images.map((image, index) => (
          <GalleryImageItem
            key={image.public_id}
            image={image}
            index={index}
            size={gridSize}
            onImageClick={openLightbox}
          />
        ))}
      </div>

      {/* Load More Button */}
      <LoadMoreButton
        onLoadMore={loadMore}
        loading={loadingMore}
        hasMore={hasMore}
        totalLoaded={totalLoaded}
        allLoadedText={dict.all_loaded}
        loadMoreText={dict.load_more}
        loadingMoreText={dict.loading_more}
        imageText={dict.image}
        imagesText={dict.images}
      />

      {/* Lightbox */}
      {lightboxOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-h-full max-w-4xl">
            <OptimizedCloudinaryImage
              publicId={selectedImage.public_id}
              alt={dict.gallery_image}
              width={1200}
              height={800}
              quality={90}
              className="max-h-full max-w-full object-contain"
            />
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/20"
              aria-label={dict.close_lightbox}
            >
              <FiX className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
