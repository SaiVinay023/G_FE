import FacebookIcon from '@mui/icons-material/FacebookOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, Button, Typography, Stack, Alert, CircularProgress } from '@mui/material';
import React, { useCallback } from 'react';

import { ConnectToFacebookModal } from 'src/components/modals/ConnectToFacebookModal';
import { useModal } from 'src/hooks/components/useModal';
import { useWhatsApp } from 'src/hooks/components/useWhatsapp';

interface WhatsAppFacebookConnectProps {
  onUploadClick: () => void;
  isUploading?: boolean;
  phoneNumberDetails?: {
    verified_name?: string;
    display_phone_number?: string;
  };
}

export const WhatsAppFacebookConnect: React.FC<WhatsAppFacebookConnectProps> = ({
  onUploadClick,
  isUploading = false,
  phoneNumberDetails,
}) => {
  const modal = useModal();

  const {
    isLoading,
    isConnected,
    error,
    launchFacebookLogin,
    disconnect,
    isSDKReady,
    whatsappCredentials,
    isWhatsAppConnected,
    isWhatsAppLoading,
  } = useWhatsApp({
    onError: (error) => {
      console.error('WhatsApp integration error:', error);
    },
  });

  const openConnectToFacebookModal = useCallback(() => {
    modal.openModal(ConnectToFacebookModal, {
      fullHeight: true,
      onModalResolved: () => {
        if (!isWhatsAppConnected) {
          launchFacebookLogin();
        }
      },
    });
  }, [modal, isWhatsAppConnected, launchFacebookLogin]);

  const handleConnectClick = useCallback(() => {
    if (isWhatsAppConnected) {
      disconnect();
    } else {
      openConnectToFacebookModal();
    }
  }, [isWhatsAppConnected, disconnect, openConnectToFacebookModal]);

  const isActionDisabled = isWhatsAppLoading || isLoading || !isSDKReady;
  const connectionStatus = isWhatsAppConnected || isConnected;
  const isRegistered = whatsappCredentials?.isRegistered || false;

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <WhatsAppIcon sx={{ fontSize: 40, color: '#25D366' }} />
        <FacebookIcon sx={{ fontSize: 40, color: '#005BD4' }} />
      </Stack>

      {!isSDKReady && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Loading Facebook SDK...
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {phoneNumberDetails && connectionStatus && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Connected Account Details
          </Typography>
          {phoneNumberDetails.verified_name && (
            <Typography variant="body2">
              <strong>Name:</strong> {phoneNumberDetails.verified_name}
            </Typography>
          )}
          {phoneNumberDetails.display_phone_number && (
            <Typography variant="body2">
              <strong>Phone:</strong> {phoneNumberDetails.display_phone_number}
            </Typography>
          )}
        </Box>
      )}

      <Box display="flex" flexDirection="column" gap={4} pt={3}>
        <Typography align="center" fontWeight={500} fontSize={[18, 22]} mt={1}>
          {connectionStatus ? 'WhatsApp Business Connected' : 'Connect your WhatsApp business account'}
        </Typography>

        <Stack alignItems="center" mt={1}>
          <Button
            disabled={isActionDisabled}
            variant="contained"
            color={connectionStatus ? 'secondary' : 'primary'}
            size="large"
            onClick={handleConnectClick}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading ? 'Connecting...' : connectionStatus ? 'Disconnect' : 'Click to Connect'}
          </Button>
        </Stack>

        {!connectionStatus && (
          <Typography variant="body2" color="textSecondary" fontSize={12} align="center">
            * WhatsApp requires a Facebook business account,
            <br />
            you can connect an existing account or set up a new business account.
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onUploadClick}
          disabled={isUploading || !connectionStatus}
        >
          {isUploading ? 'Uploading...' : 'Upload Customers'}
        </Button>
      </Box>
    </>
  );
};
