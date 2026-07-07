import { useState, useCallback } from 'react';
import { useSupabase } from 'src/app/SupabaseProvider';
import { useAuth } from '@clerk/nextjs';

type UploadOptions = {
  bucketName?: string;
  folderPath?: string;
  cacheControl?: string;
  upsert?: boolean;
  useSignedUrl?: boolean;
  expiresIn?: number;
};

type UploadResult = {
  url: string;
  path: string;
  error: unknown | null;
};

/**
 * Custom hook for uploading files to Supabase Storage
 */
export const useStorageUpload = () => {
  const { supabase } = useSupabase();
  const { userId } = useAuth();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  /**
   * Uploads a file to Supabase Storage and returns the URL
   * For protected buckets, it will return a signed URL by default
   *
   * @param file - The file to upload
   * @param options - Upload options
   * @returns Object containing the URL of the uploaded file and any error that occurred
   */
  const uploadFile = useCallback(
    async (file: File, options: UploadOptions = {}): Promise<UploadResult> => {
      const {
        bucketName = 'protected',
        folderPath = `${userId}`,
        cacheControl = '3600',
        upsert = false,
        useSignedUrl = bucketName === 'protected',
        expiresIn = 60 * 60,
      } = options;

      setIsUploading(true);

      let url = '';
      let path = '';
      let uploadError = null;

      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }

        if (!file) {
          throw new Error('No file provided for upload');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${folderPath}/${Date.now()}.${fileExt}`;
        path = fileName;

        const { error } = await supabase.storage.from(bucketName).upload(fileName, file, {
          cacheControl,
          upsert,
        });

        if (error) {
          throw error;
        }

        if (useSignedUrl) {
          const { data: signedData, error: signedError } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(fileName, expiresIn);

          if (!signedError && signedData?.signedUrl) {
            url = signedData.signedUrl;
          } else {
            console.warn('Failed to create signed URL, falling back to public URL', signedError);
            const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
            url = publicUrlData?.publicUrl || '';
          }
        } else {
          const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
          url = publicUrlData?.publicUrl || '';
        }
      } catch (error: unknown) {
        console.error('File upload error:', error);
        uploadError = error;
      } finally {
        setIsUploading(false);
      }

      return { url, path, error: uploadError };
    },
    [supabase, userId],
  );

  return {
    uploadFile,
    isUploading,
  };
};
