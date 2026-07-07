export interface WhatsAppCredentials {
  id: string;
  shopId: string;
  phoneNumberId: string;
  wbaId: string;
  isRegistered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateWhatsAppCredentialsRequest {
  phoneNumberId: string;
  wbaId: string;
  accessToken: string;
}

export interface WhatsAppAuthData {
  code: string;
}

export interface WhatsAppSignupData {
  phoneNumberId: string;
  wabaId: string;
}
