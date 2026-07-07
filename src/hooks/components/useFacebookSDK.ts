'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { getClientConfig } from 'src/utils/runtimeConfig';
import { WHATSAPP_CONSTANTS, FACEBOOK_CONFIG } from 'src/constants/whatsapp';

interface UseFacebookSDKReturn {
  isSDKReady: boolean;
  isLoading: boolean;
  error: string | null;
  initializeSDK: () => void;
}

declare global {
  interface Window {
    FB?: {
      init: (config: any) => void;
      login: (callback: (response: any) => void, options: any) => void;
      logout: (callback?: () => void) => void;
      getLoginStatus: (callback: (response: any) => void) => void;
    };
    fbAsyncInit?: () => void;
  }
}

export const useFacebookSDK = (): UseFacebookSDKReturn => {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sdkLoadedRef = useRef(false);
  const initAttemptedRef = useRef(false);

  const clientConfig = getClientConfig();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: Error | string) => {
    const errorMessage = err instanceof Error ? err.message : err;
    setError(errorMessage);
    setIsLoading(false);
    toast.error(`Facebook SDK Error: ${errorMessage}`);
  }, []);

  const initializeSDK = useCallback(() => {
    if (!clientConfig.facebookAppId) {
      handleError('Facebook App ID is not configured');
      return;
    }

    if (initAttemptedRef.current) {
      return;
    }

    initAttemptedRef.current = true;
    setIsLoading(true);
    clearError();

    // Check if SDK is already loaded
    if (window.FB && !isSDKReady) {
      try {
        // Proper Facebook SDK initialization
        window.FB.init({
          appId: clientConfig.facebookAppId,
          cookie: FACEBOOK_CONFIG.cookie,
          xfbml: FACEBOOK_CONFIG.xfbml,
          version: FACEBOOK_CONFIG.version,
        });
        setIsSDKReady(true);
        setIsLoading(false);
        console.log('Facebook SDK initialized successfully');
        return;
      } catch (err) {
        handleError(err instanceof Error ? err : new Error('Failed to initialize Facebook SDK'));
        return;
      }
    }

    // Setup async initialization
    window.fbAsyncInit = () => {
      try {
        if (!window.FB) {
          throw new Error('Facebook SDK failed to load');
        }

        // Proper Facebook SDK initialization
        window.FB.init({
          appId: clientConfig.facebookAppId,
          cookie: FACEBOOK_CONFIG.cookie,
          xfbml: FACEBOOK_CONFIG.xfbml,
          version: FACEBOOK_CONFIG.version,
        });

        setIsSDKReady(true);
        setIsLoading(false);
        console.log('Facebook SDK initialized successfully');
      } catch (err) {
        handleError(err instanceof Error ? err : new Error('Failed to initialize Facebook SDK'));
      }
    };

    // Load SDK script if not already loaded
    if (!sdkLoadedRef.current && !document.getElementById('facebook-jssdk')) {
      sdkLoadedRef.current = true;

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = WHATSAPP_CONSTANTS.FACEBOOK_SDK_URL;
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        console.log('Facebook SDK script loaded');
      };

      script.onerror = () => {
        sdkLoadedRef.current = false;
        initAttemptedRef.current = false;
        handleError('Failed to load Facebook SDK script');
      };

      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    }
  }, [clientConfig.facebookAppId, isSDKReady, clearError, handleError]);

  useEffect(() => {
    initializeSDK();
  }, [initializeSDK]);

  return {
    isSDKReady,
    isLoading,
    error,
    initializeSDK,
  };
};
