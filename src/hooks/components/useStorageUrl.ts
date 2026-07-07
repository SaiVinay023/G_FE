import { useState, useEffect, useCallback, useRef } from 'react';
import { useSupabase } from 'src/app/SupabaseProvider';

/**
 * Extracts the relative path from a Supabase Storage URL
 */
const extractPathFromUrl = (fullUrl: string | null | undefined, bucket: string): string | null => {
  if (!fullUrl) return null;

  try {
    // If it's already a relative path, return as-is
    if (!fullUrl.includes('http') && !fullUrl.includes('/storage/')) {
      return fullUrl;
    }

    // Extract from full Supabase URL
    const regex = new RegExp(`\\/storage\\/v\\d+\\/object\\/(?:public|auth)\\/${bucket}\\/(.*)`);
    const match = fullUrl.match(regex);

    if (match?.[1]) {
      return match[1];
    }

    // Fallback: extract after bucket name
    if (fullUrl.includes(`/${bucket}/`)) {
      const parts = fullUrl.split(`/${bucket}/`);
      if (parts.length > 1) {
        return parts[1];
      }
    }

    console.warn('Could not extract path from URL:', fullUrl);
    return fullUrl;
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    return fullUrl;
  }
};

interface UseStorageUrlReturn {
  url: string | null;
  isLoading: boolean;
  error: Error | null;
  refreshUrl: () => Promise<string | null>;
}

/**
 * Custom hook for getting signed URLs for Supabase Storage files
 * Optimized with request tracking to prevent race conditions
 */
export const useStorageUrl = (
  inputPath: string | null | undefined,
  bucket: string = 'protected',
  expiresIn: number = 3600, // Increased default to 1 hour
): UseStorageUrlReturn => {
  const { supabase } = useSupabase();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Track current request to prevent race conditions
  const currentRequestRef = useRef<number>(0);

  const path = inputPath ? extractPathFromUrl(inputPath, bucket) : null;

  /**
   * Fetch signed URL with race condition protection
   */
  const getSignedUrl = useCallback(async (): Promise<string | null> => {
    if (!path || !supabase) {
      setIsLoading(false);
      return null;
    }

    // Increment request counter
    const requestId = ++currentRequestRef.current;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Requesting signed URL for:', { bucket, path, requestId });

      const { data, error: signedUrlError } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);

      // Check if this is still the latest request
      if (requestId !== currentRequestRef.current) {
        console.log('Discarding outdated signed URL request:', requestId);
        return null;
      }

      if (signedUrlError) {
        throw signedUrlError;
      }

      if (data?.signedUrl) {
        setUrl(data.signedUrl);
        console.log('Received signed URL:', { requestId, url: data.signedUrl });
        return data.signedUrl;
      }

      // Fallback to public URL
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
      if (publicUrlData?.publicUrl) {
        setUrl(publicUrlData.publicUrl);
        console.log('Using public URL fallback:', { requestId, url: publicUrlData.publicUrl });
        return publicUrlData.publicUrl;
      }

      setUrl(null);
      return null;
    } catch (err) {
      // Only set error if this is still the latest request
      if (requestId === currentRequestRef.current) {
        const errorMessage = err instanceof Error ? err : new Error('Unknown error getting signed URL');
        console.error('Error getting signed URL:', errorMessage);
        setError(errorMessage);
        setUrl(null);
      }
      return null;
    } finally {
      // Only set loading to false if this is still the latest request
      if (requestId === currentRequestRef.current) {
        setIsLoading(false);
      }
    }
  }, [supabase, bucket, path, expiresIn]);

  /**
   * Effect to fetch URL when dependencies change
   */
  useEffect(() => {
    // Reset state when path changes
    setUrl(null);
    setError(null);
    currentRequestRef.current = 0;

    if (path && supabase) {
      getSignedUrl();
    } else {
      setIsLoading(false);
    }
  }, [path, supabase]); // Removed getSignedUrl from deps to prevent infinite loops

  return { url, isLoading, error, refreshUrl: getSignedUrl };
};
