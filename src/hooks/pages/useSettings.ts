'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'src/i18n/routing';
import { useAuth, useUser as useClerkUser } from '@clerk/nextjs';
import { useAppDispatch } from 'src/hooks/store'; // or wherever your typed hooks are defined

import { CreateShop, Shop, UserRole } from 'src/models';
import { useShop } from './useShop';
import { useUser } from './useUser';
import { useStorageUpload } from 'src/hooks/components/useStorageUpload';
import { FormData } from 'src/components/pages/Settings/SettingsForm';
import { cannedJobApi } from 'src/api/cannedJobApi';

interface UseSettingsProps {
  initialData?: Shop;
}

interface UseSettingsReturn {
  shop?: Shop;
  loading: boolean;
  error: string | null;
  isSaving: boolean;
  handleSave: (formData: (CreateShop & FormData) | (Partial<Shop> & FormData)) => Promise<void>;
}

/**
 * Simplified settings hook focused only on data management
 * Logo management is now handled by useLogoManager
 */
export const useSettings = ({ initialData }: UseSettingsProps = {}): UseSettingsReturn => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { shop: shopFromStore, loading: shopLoading, error: shopError, createShop, updateShop } = useShop();
  const { user: userData, shopId, loading: userLoading, error: userError } = useUser();
  const { userId } = useAuth();
  const { user: clerkUser } = useClerkUser();
  const { uploadFile } = useStorageUpload();

  const [shopData, setShopData] = useState<Shop | undefined>(initialData || shopFromStore);
  const [isSaving, setIsSaving] = useState(false);

  const loading = shopLoading || userLoading;
  const error = shopError || userError;

  useEffect(() => {
    setShopData(initialData || shopFromStore);
  }, [initialData, shopFromStore]);

  /**
   * Create default work schedules for new shops
   */
  const createDefaultWorkSchedules = useCallback(() => {
    const weekdaySchedule = {
      start: '08:00:00',
      finish: '17:00:00',
      dayOff: false,
      breakFrom: '12:00:00',
      breakTo: '13:00:00',
    };

    const weekendSchedule = {
      start: '00:00:00',
      finish: '00:00:00',
      dayOff: true,
      breakFrom: '00:00:00',
      breakTo: '00:00:00',
    };

    return [
      ...Array.from({ length: 5 }, (_, index) => ({
        ...weekdaySchedule,
        day: index,
      })),
      { ...weekendSchedule, day: 5 },
      { ...weekendSchedule, day: 6 },
    ];
  }, []);

  /**
   * Handle form submission with file upload
   */
  const handleSave = useCallback(
    async (formData: (CreateShop & FormData) | (Partial<Shop> & FormData)) => {
      try {
        setIsSaving(true);

        const { _logoFile, ...restFormData } = formData;
        let logoUrl = shopData?.logo;

        // Upload logo file if provided
        if (_logoFile) {
          try {
            const { url, error: uploadError } = await uploadFile(_logoFile, {
              folderPath: `${userId}/logo`,
              cacheControl: '3600',
              bucketName: 'protected',
            });

            if (uploadError) {
              console.error('Failed to upload logo:', uploadError);
              throw new Error('Failed to upload logo');
            }

            logoUrl = url;
            console.log('Logo uploaded successfully:', url);
          } catch (uploadError) {
            console.error('Logo upload error:', uploadError);
            throw uploadError;
          }
        }

        const prepareSubmissionData = (data: any) => {
          const submissionData = { ...data };

          // Handle logo URL
          if (logoUrl) {
            submissionData.logo = logoUrl;
          }

          // Extract VAT ID and remove selectedVat object
          if (submissionData.selectedVat?.id) {
            submissionData.vatId = submissionData.selectedVat.id;
          }
          delete submissionData.selectedVat;

          return submissionData;
        };

        if (shopData?.id) {
          // Update existing shop
          const cleanData = { ...restFormData };

          // Clean nested objects to avoid conflicts
          if (cleanData.contact) {
            const { id, createdAt, updatedAt, ...contact } = cleanData.contact;
            cleanData.contact = contact;
          }

          if (cleanData.address) {
            const { id, createdAt, updatedAt, ...address } = cleanData.address;
            cleanData.address = address;
          }

          const submissionData = prepareSubmissionData(cleanData);
          const updatedShop = await updateShop(shopData.id, submissionData);
          setShopData(updatedShop);
          console.log('Shop updated successfully');
        } else {
          // Create new shop
          const userContact = {
            email: clerkUser?.primaryEmailAddress?.emailAddress || '',
            phone: clerkUser?.primaryPhoneNumber?.phoneNumber || restFormData.contact?.phone || '',
          };

          const weeklySchedule = createDefaultWorkSchedules();

          const shopCreationData = {
            // User data
            firstName: clerkUser?.firstName || '',
            lastName: clerkUser?.lastName || '',
            role: { name: UserRole.Owner },

            // Shop data with logo
            ...prepareSubmissionData(restFormData),

            // Contact and address
            contact: {
              ...restFormData.contact,
              email: userContact.email,
              phone: userContact.phone,
            },
            address: restFormData.address,

            // Work schedules
            weeklySchedule,
          };

          const createdShop = await createShop(shopCreationData as CreateShop);
          setShopData(createdShop);

          try {
            await dispatch(cannedJobApi.endpoints.createPredefinedCannedJob.initiate()).unwrap();
          } catch (cannedJobError) {}

          router.replace('/today');
        }
      } catch (err) {
        console.error('Failed to save shop settings:', err);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [createShop, updateShop, shopData, router, uploadFile, userId, clerkUser, createDefaultWorkSchedules, dispatch],
  );

  return {
    shop: shopData,
    loading,
    error,
    isSaving,
    handleSave,
  };
};
