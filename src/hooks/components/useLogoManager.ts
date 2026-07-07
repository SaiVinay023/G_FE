import { useState, useEffect, useCallback, useRef } from 'react';
import { useStorageUrl } from './useStorageUrl';

interface UseLogoManagerReturn {
  displayUrl: string | null;
  isLoading: boolean;
  error: Error | null;
  selectedFile: File | null;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageLoad: () => void;
  handleImageError: () => void;
  getButtonText: (t: any, isUploading: boolean) => string;
}

/**
 * Centralized logo management hook that handles both local file previews
 * and signed URLs with proper state management and no conflicts
 */
export const useLogoManager = (initialLogoPath?: string | null): UseLogoManagerReturn => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<Error | null>(null);

  // Only fetch signed URL when no local file is selected
  const shouldFetchSignedUrl = !selectedFile && initialLogoPath;
  const {
    url: signedUrl,
    isLoading: signedUrlLoading,
    error: signedUrlError,
  } = useStorageUrl(shouldFetchSignedUrl ? initialLogoPath : null);

  // Cleanup ref for blob URLs
  const cleanupRef = useRef<string | null>(null);

  // Determine which URL to display with clear priority
  const displayUrl = localPreviewUrl || signedUrl;

  // Determine loading state
  const isLoading = imageLoading || (!selectedFile && signedUrlLoading);

  // Determine error state
  const error = imageError || signedUrlError;

  /**
   * Handle file selection with proper cleanup
   */
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean up previous blob URL
    if (cleanupRef.current) {
      URL.revokeObjectURL(cleanupRef.current);
      cleanupRef.current = null;
    }

    // Create new blob URL
    const blobUrl = URL.createObjectURL(file);
    cleanupRef.current = blobUrl;

    // Update state
    setSelectedFile(file);
    setLocalPreviewUrl(blobUrl);
    setImageError(null);
    setImageLoading(false);

    console.log('Logo file selected:', { fileName: file.name, blobUrl });
  }, []);

  /**
   * Handle successful image load
   */
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(null);
    console.log('Logo image loaded successfully');
  }, []);

  /**
   * Handle image load error
   */
  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(new Error('Failed to load image'));
    console.error('Logo image failed to load');
  }, []);

  /**
   * Get appropriate button text based on current state
   */
  const getButtonText = useCallback(
    (t: any, isUploading: boolean) => {
      if (isUploading) {
        return t('common.uploading');
      }
      if (selectedFile) {
        return t('Settings.changeLogo');
      }
      if (signedUrl) {
        return t('Settings.changeLogo');
      }
      return t('Settings.uploadLogo');
    },
    [selectedFile, signedUrl],
  );

  /**
   * Cleanup blob URLs on unmount or when file changes
   */
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        URL.revokeObjectURL(cleanupRef.current);
        cleanupRef.current = null;
      }
    };
  }, []);

  /**
   * Reset local state when initial logo path changes
   */
  useEffect(() => {
    if (initialLogoPath !== undefined) {
      // Reset local file selection when shop changes
      setSelectedFile(null);
      if (cleanupRef.current) {
        URL.revokeObjectURL(cleanupRef.current);
        cleanupRef.current = null;
      }
      setLocalPreviewUrl(null);
      setImageError(null);
    }
  }, [initialLogoPath]);

  return {
    displayUrl,
    isLoading,
    error,
    selectedFile,
    handleFileSelect,
    handleImageLoad,
    handleImageError,
    getButtonText,
  };
};
