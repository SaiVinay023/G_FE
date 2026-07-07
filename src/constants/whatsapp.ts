export const WHATSAPP_CONSTANTS = {
  API_VERSION: 'v23.0', // Updated to latest version
  GRAPH_API_URL: 'https://graph.facebook.com/v23.0',
  FACEBOOK_SDK_URL: 'https://connect.facebook.net/en_US/sdk.js',
  FACEBOOK_ORIGIN: 'https://www.facebook.com',

  SCOPES: 'business_management,whatsapp_business_management',

  WEBHOOK_EVENTS: {
    WA_EMBEDDED_SIGNUP: 'WA_EMBEDDED_SIGNUP',
    FINISH: 'FINISH',
  },

  MESSAGE_TYPES: {
    TEXT: 'text' as const,
    IMAGE: 'image' as const,
  },

  RATE_LIMITS: {
    MESSAGES_PER_MINUTE: 100,
    API_CALLS_PER_SECOND: 50,
  },
} as const;

// Updated Facebook configuration with proper structure
export const FACEBOOK_CONFIG = {
  cookie: true,
  xfbml: true,
  version: 'v23.0', // Direct version assignment without spread
} as const;

// WhatsApp specific login configuration
export const WHATSAPP_LOGIN_CONFIG = {
  response_type: 'code',
  override_default_response_type: true,
  scope: WHATSAPP_CONSTANTS.SCOPES,
  extras: {
    setup: {},
    feature: 'whatsapp_embedded_signup',
    version: 2,
    sessionInfoVersion: 2,
  },
} as const;
