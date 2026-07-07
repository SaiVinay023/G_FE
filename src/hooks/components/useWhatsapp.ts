'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { getClientConfig } from 'src/utils/runtimeConfig';
import { WHATSAPP_CONSTANTS, WHATSAPP_LOGIN_CONFIG } from 'src/constants/whatsapp';
import { useFacebookSDK } from './useFacebookSDK';
import { WhatsAppActions } from 'src/store/slices/whatsappSlice';
import {
  selectWhatsAppCredentials,
  selectWhatsAppConnectionStatus,
  selectWhatsAppLoading,
  selectWhatsAppUpdating,
} from 'src/store/selectors/whatsappSelectors';

interface FacebookLoginResponse {
  authResponse?: {
    code: string;
    accessToken?: string;
  };
  status: 'connected' | 'not_authorized' | 'unknown';
}

interface EmbeddedSignupData {
  type: string;
  event: string;
  data: {
    phone_number_id: string;
    waba_id: string;
  };
}

interface UseWhatsAppConfig {
  onError?: (error: Error) => void;
}

interface UseWhatsAppReturn {
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  launchFacebookLogin: () => void;
  disconnect: () => void;
  isSDKReady: boolean;
  whatsappCredentials: ReturnType<typeof selectWhatsAppCredentials>;
  isWhatsAppConnected: boolean;
  whatsappLoading: boolean;
  whatsappUpdating: boolean;
  isWhatsAppLoading: boolean;
}

export const useWhatsApp = (config: UseWhatsAppConfig = {}): UseWhatsAppReturn => {
  const { userId } = useAuth();
  const { onError } = config;
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messageListenerAttached = useRef(false);

  const clientConfig = getClientConfig();
  const { isSDKReady, error: sdkError } = useFacebookSDK();

  const whatsappCredentials = useSelector(selectWhatsAppCredentials);
  const isWhatsAppConnected = useSelector(selectWhatsAppConnectionStatus);
  const whatsappLoading = useSelector(selectWhatsAppLoading);
  const whatsappUpdating = useSelector(selectWhatsAppUpdating);

  const isWhatsAppLoading = whatsappLoading || whatsappUpdating;
  const isConnected = isWhatsAppConnected || Boolean(whatsappCredentials?.isRegistered);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback(
    (err: Error | string) => {
      const errorMessage = err instanceof Error ? err.message : err;
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
    },
    [onError],
  );

  const handleAuthSuccess = useCallback(
    (code: string) => {
      dispatch(WhatsAppActions.setPendingAuthCode(code));
    },
    [dispatch],
  );

  const handleSignupComplete = useCallback(
    (data: { phoneNumberId: string; wabaId: string }) => {
      dispatch(
        WhatsAppActions.setPendingSignupData({
          phoneNumberId: data.phoneNumberId,
          wbaId: data.wabaId,
        }),
      );
    },
    [dispatch],
  );

  const handlePostMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== WHATSAPP_CONSTANTS.FACEBOOK_ORIGIN) return;

      try {
        const data: EmbeddedSignupData = JSON.parse(event.data);

        if (
          data.type === WHATSAPP_CONSTANTS.WEBHOOK_EVENTS.WA_EMBEDDED_SIGNUP &&
          data.event === WHATSAPP_CONSTANTS.WEBHOOK_EVENTS.FINISH
        ) {
          const { phone_number_id, waba_id } = data.data;

          if (phone_number_id && waba_id) {
            handleSignupComplete({
              phoneNumberId: phone_number_id,
              wabaId: waba_id,
            });
            toast.success('WhatsApp Business account connected successfully!');
          }
        }
      } catch (err) {
        console.warn('Failed to parse Facebook postMessage data:', err);
      }
    },
    [handleSignupComplete],
  );

  const attachMessageListener = useCallback(() => {
    if (messageListenerAttached.current) return;

    window.addEventListener('message', handlePostMessage);
    messageListenerAttached.current = true;

    return () => {
      window.removeEventListener('message', handlePostMessage);
      messageListenerAttached.current = false;
    };
  }, [handlePostMessage]);

  const launchFacebookLogin = useCallback(() => {
    if (!window.FB) {
      handleError('Facebook SDK not ready');
      return;
    }

    if (!isSDKReady) {
      handleError('Facebook SDK is still loading');
      return;
    }

    if (!userId) {
      handleError('User not authenticated');
      return;
    }

    clearError();
    setIsLoading(true);

    try {
      window.FB.login(
        (response: FacebookLoginResponse) => {
          setIsLoading(false);

          if (response.authResponse?.code) {
            handleAuthSuccess(response.authResponse.code);
            toast.success('Facebook authentication successful!');
          } else {
            handleError('Facebook login was cancelled or failed');
          }
        },
        {
          config_id: clientConfig.facebookConfigId,
          ...WHATSAPP_LOGIN_CONFIG,
        },
      );
    } catch (err) {
      setIsLoading(false);
      handleError(err instanceof Error ? err : new Error('Failed to launch Facebook login'));
    }
  }, [userId, handleAuthSuccess, clearError, handleError, clientConfig.facebookConfigId, isSDKReady]);

  const disconnect = useCallback(() => {
    setError(null);
    dispatch(WhatsAppActions.clearCredentials());

    if (window.FB) {
      window.FB.logout(() => {
        toast.success('Disconnected from WhatsApp Business');
      });
    }
  }, [dispatch]);

  useEffect(() => {
    const cleanup = attachMessageListener();
    return cleanup;
  }, [attachMessageListener]);

  const combinedError = sdkError || error;

  return {
    isLoading,
    isConnected,
    error: combinedError,
    launchFacebookLogin,
    disconnect,
    isSDKReady,
    whatsappCredentials,
    isWhatsAppConnected,
    whatsappLoading,
    whatsappUpdating,
    isWhatsAppLoading,
  };
};
