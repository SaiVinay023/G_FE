# WhatsApp Business Integration Documentation

## Overview

This document provides comprehensive documentation for the WhatsApp Business integration within the Carsu platform. The integration allows garage shops to connect their WhatsApp Business accounts, receive and send messages, manage message templates, and interact with customers through WhatsApp.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Webhook Implementation](#webhook-implementation)
7. [Message Templates](#message-templates)
8. [Frontend Integration](#frontend-integration)
9. [Complete Code Reference](#complete-code-reference)
10. [Environment Variables](#environment-variables)
11. [Suggestions for V2 Improvements](#suggestions-for-v2-improvements)

## Architecture Overview

The WhatsApp integration follows a multi-layered architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │────│   tRPC API       │────│   Database      │
│   (Next.js)     │    │   (Backend)      │    │   (PostgreSQL)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Facebook      │────│   Webhooks       │────│   WhatsApp      │
│   SDK           │    │   Handling       │    │   Business API  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Integration Points:

1. **Facebook SDK**: Used for authentication and embedded signup
2. **WhatsApp Business API**: Facebook Graph API v21.0 for messaging
3. **Webhooks**: Real-time message and status updates
4. **tRPC**: Type-safe API layer for frontend-backend communication

## Core Components

### 1. WhatsApp Router (`packages/api/src/router/whatsapp.ts`)

Main API handler containing all WhatsApp-related endpoints:

- **Authentication**: OAuth flow with Facebook
- **Message Management**: Send/receive messages, templates
- **Media Handling**: Image uploads and retrieval
- **Template Synchronization**: Sync message templates
- **Connection Management**: Connect/disconnect WhatsApp accounts

### 2. Database Schema (`packages/db/schema/whatsapp.ts`)

```typescript
export const whatsapp = pgTable("whatsapp", {
  id: PRIMARY_KEY_COLUMN,
  messageId: text("message_id").unique(),
  sender: text("sender").notNull(),
  receiver: text("receiver").notNull(),
  message: text("message"),
  read: boolean("read").default(false),
  status: text("status"),
  shopId: uuid("shop_id").references(() => shops.id).notNull(),
  metadata: jsonb("metadata"),
  imageUrl: text("image_url"),
  createdAt: CREATED_AT_COLUMN,
});
```

### 3. Shop Extensions (`packages/db/schema/shop.ts`)

WhatsApp-related fields added to shops table:

```typescript
whatsappPhoneNumberId: text("whatsapp_phone_number_id"),
whatsappWabaId: text("whatsapp_waba_id"),
whatsappAccessToken: text("whatsapp_access_token"),
isWhatsappRegistered: boolean("is_whatsapp_registered").default(false),
```

### 4. Webhook Handler (`apps/nextjs/src/app/api/webhook/route.ts`)

Handles incoming WhatsApp webhooks for:
- Message reception
- Message status updates
- New customer creation
- Notification management

## Database Schema

### WhatsApp Messages Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| messageId | TEXT | WhatsApp message ID (unique) |
| sender | TEXT | Phone number of sender |
| receiver | TEXT | Phone number of receiver |
| message | TEXT | Message content |
| read | BOOLEAN | Read status (default: false) |
| status | TEXT | Message status (sent, delivered, read, failed) |
| shopId | UUID | Foreign key to shops table |
| metadata | JSONB | Additional metadata (errors, etc.) |
| imageUrl | TEXT | URL for image messages |
| createdAt | TIMESTAMP | Creation timestamp |

### Shop Table WhatsApp Fields

| Column | Type | Description |
|--------|------|-------------|
| whatsappPhoneNumberId | TEXT | WhatsApp phone number ID |
| whatsappWabaId | TEXT | WhatsApp Business Account ID |
| whatsappAccessToken | TEXT | Access token for API calls |
| isWhatsappRegistered | BOOLEAN | Registration status |

## API Endpoints

### WhatsApp Router Endpoints

#### Authentication & Setup

1. **`auth`** - OAuth authentication
   - Input: Authorization code from Facebook
   - Process: Exchange code for access token
   - Output: Stores access token in database

2. **`updateWhatsappShop`** - Update shop WhatsApp details
   - Input: `{ wabaId?: string, phoneNumberId?: string }`
   - Process: Updates shop with WhatsApp IDs
   - Triggers: Template sync, subscription, registration

3. **`subscribe`** - Subscribe to webhooks
   - Process: Subscribes WABA to webhook notifications
   - Required: Valid access token

4. **`register`** - Register phone number
   - Input: `{ phoneNumberId: string }`
   - Process: Registers phone number with WhatsApp
   - Sets: `isWhatsappRegistered: true`

#### Message Management

5. **`sendText`** - Send text/image messages
   ```typescript
   input: {
     to: string,
     message?: string,
     type?: "text" | "image",
     mediaId?: string,
     imageUrl?: string
   }
   ```

6. **`messages`** - Get conversation messages
   ```typescript
   input: {
     sender: string,
     receiver: string
   }
   ```

7. **`readMessages`** - Mark messages as read
   ```typescript
   input: {
     sender: string,
     receiver: string
   }
   ```

8. **`getUnreadMessages`** - Get unread message count
   ```typescript
   input: {
     phoneNumber: string
   }
   ```

#### Template Management

9. **`getTemplates`** - Get available message templates
   - Input: `{ customerId: string }`
   - Output: Pre-filled templates with customer data

10. **`checkIfSync`** - Check template sync status
    - Output: Boolean indicating if templates need sync

11. **`syncTemplate`** - Sync message templates
    - Process: Copies templates from master WABA to shop WABA

#### Media & Utilities

12. **`uploadImage`** - Upload image for messaging
    - Input: `{ file: any }`
    - Output: Media ID and metadata

13. **`getPhonenumberDetails`** - Get phone number info
    - Output: Phone number verification status and details

14. **`sendQuickShareLink`** - Send appointment links via WhatsApp
    ```typescript
    input: {
      body: string,
      phone: string
    }
    ```

#### Connection Management

15. **`disconnect`** - Disconnect WhatsApp (partial)
    - Process: Removes access token only

16. **`deauth`** - Full deauthorization
    - Process: Revokes token and cleans up

## Authentication & Authorization

### OAuth Flow

1. **Frontend Initiation**: User clicks "Connect WhatsApp"
2. **Facebook SDK**: Loads embedded signup flow
3. **User Authorization**: User authorizes app access
4. **Code Exchange**: Frontend receives authorization code
5. **Token Exchange**: Backend exchanges code for access token
6. **Storage**: Access token stored in database

### Facebook App Configuration

Required Facebook app setup:
- App ID: `NEXT_PUBLIC_FACEBOOK_APP_ID`
- App Secret: `FACEBOOK_APP_SECRET`
- Config ID: `NEXT_PUBLIC_FACEBOOK_CONFIG_ID`
- WhatsApp Product enabled
- Webhook configuration

### Scopes Required

```javascript
scope: "business_management,whatsapp_business_management"
```

## Webhook Implementation

### Webhook Verification (GET)

```typescript
export const GET = (req: NextRequest) => {
  const query = req.nextUrl.searchParams;
  const mode = query.get("hub.mode");
  const token = query.get("hub.verify_token");
  const challenge = query.get("hub.challenge");

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse(null, { status: 403 });
  }
};
```

### Webhook Processing (POST)

Handles two main event types:

#### 1. Incoming Messages
```typescript
const message = body?.entry?.[0]?.changes[0]?.value?.messages?.[0];
if (message?.type === "text") {
  // Process incoming message
  // Create new customer if doesn't exist
  // Store message in database
  // Create notification
}
```

#### 2. Message Status Updates
```typescript
const status = body?.entry?.[0]?.changes?.[0]?.value?.statuses?.[0];
if (status?.id) {
  // Update message status (sent, delivered, read, failed)
}
```

### Webhook Payload Examples

**Incoming Text Message:**
```json
{
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "1234567890",
              "phone_number_id": "106540872408298"
            },
            "messages": [
              {
                "from": "1234567890",
                "id": "wamid.xxx",
                "timestamp": "1667392221",
                "text": {
                  "body": "Hello, I need help with my car"
                },
                "type": "text"
              }
            ]
          }
        }
      ],
      "id": "105533125602783"
    }
  ]
}
```

## Message Templates

### Template Structure

Templates are predefined message formats with placeholders:

```typescript
interface MessageTemplate {
  name: string;
  components: Component[];
  language: string;
  status: string;
  category: string;
  sub_category?: string;
  id: string;
}

interface Component {
  type: string;
  text: string;
  example: {
    body_text: string[][];
  };
}
```

### Available Templates

The system includes various pre-built templates:

1. **Appointment Related**:
   - `appointment_confirmation_1` - Appointment confirmation
   - `appointment_reminder` - Appointment reminders

2. **Service Related**:
   - `car_ready` - Car ready for pickup
   - `send_estimate` - Send service estimates

3. **Follow-up**:
   - `1_month_followup` - One month service follow-up
   - `postservice_followup_1_week` - Post-service follow-up

4. **Seasonal**:
   - `seasonal_before_holidays` - Pre-holiday reminders
   - `seasonal_winter_rush` - Winter service rush

### Template Localization

Templates support multiple languages:
- English (en)
- Italian (it) 
- Spanish (es)
- German (de)
- French (fr)
- Dutch (nl)
- Greek (el)

### Template Synchronization

```typescript
// Master templates from system WABA
const masterTemplates = await fetchTemplates(env.WHATSAPP_WABA_ID);

// User's existing templates
const userTemplates = await fetchTemplates(shop.whatsappWabaId);

// Sync missing templates
for (const template of masterTemplates) {
  if (!userTemplates.includes(template.name)) {
    await createTemplate(shop.whatsappWabaId, template);
  }
}
```

## Frontend Integration

### Settings Page Integration

Location: `apps/nextjs/src/app/[locale]/shop/settings/page.tsx`

#### Key Components:

1. **Facebook SDK Loading**:
```typescript
useEffect(() => {
  // Load Facebook SDK
  window.fbAsyncInit = function () {
    FB.init({
      appId: env.NEXT_PUBLIC_FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: WHATS_APP_API_VERSION,
    });
  };
}, []);
```

2. **WhatsApp Signup Launch**:
```typescript
const launchWhatsAppSignup = () => {
  FB.login(function (response) {
    if (response.authResponse) {
      const code = response.authResponse.code;
      connectWhatsApp.mutate(code);
    }
  }, {
    config_id: env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID,
    response_type: "code",
    scope: "business_management,whatsapp_business_management",
    extras: {
      feature: "whatsapp_embedded_signup",
      version: 2,
    },
  });
};
```

3. **Embedded Signup Event Handling**:
```typescript
useEffect(() => {
  const handlePostMessage = (event: MessageEvent) => {
    if (event.origin !== "https://www.facebook.com") return;
    
    const data = JSON.parse(event.data);
    if (data.type === "WA_EMBEDDED_SIGNUP") {
      if (data.event === "FINISH") {
        const { phone_number_id, waba_id } = data.data;
        updateWhatsappShop.mutate({
          phoneNumberId: phone_number_id,
          wabaId: waba_id,
        });
      }
    }
  };
  
  window.addEventListener("message", handlePostMessage);
  return () => window.removeEventListener("message", handlePostMessage);
}, []);
```

### Modal Component

`ConnectToFacebookModal` provides user information about:
- WhatsApp usage rules
- Pricing information (first 1,000 messages free)
- Business account requirements
- Payment method recommendations

## Complete Code Reference

### Core WhatsApp Router Code

```typescript
/* packages/api/src/router/whatsapp.ts */
import { cleanPhoneNumber } from "@common/utils/cleanPhoneNumber";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { format } from "date-fns";
import { parsePhoneNumber } from "libphonenumber-js";
import { z } from "zod";

import { and, asc, count, desc, eq, inArray, or, schema } from "@carsu/db";
import { quickShareContacts } from "@carsu/db/schema/quickShareContacts";
import { shops } from "@carsu/db/schema/shop";
import { whatsapp } from "@carsu/db/schema/whatsapp";
import { getQuickSharePhoneContactFilter } from "@carsu/db/utils/filters";
import { QuickShareWhatsappSchema } from "@carsu/types/api";
import type { OAuthAccessTokenResponse } from "@carsu/types/api";
import type { ShareContact } from "@carsu/types/db";
import type { Shop } from "@carsu/types/frontend";

import { WHATS_APP_API_URL } from "../cache/whatsapp";
import { env } from "../env.mjs";
import { sendWhatsAppText } from "../services/utils";
import { createTRPCRouter, shopMemberProcedure } from "../trpc";

export const whatsappRouter = createTRPCRouter({
  // Authentication endpoint
  auth: shopMemberProcedure.input(z.string()).mutation(async (opts) => {
    const { ctx, input } = opts;

    try {
      const url = `${WHATS_APP_API_URL}/oauth/access_token`;

      const response = await axios.post(url, {
        client_id: env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        client_secret: env.FACEBOOK_APP_SECRET,
        code: input,
        grant_type: "authorization_code",
      });

      const { access_token }: OAuthAccessTokenResponse = response.data;

      await ctx.db
        .update(schema.shops)
        .set({ whatsappAccessToken: access_token })
        .where(eq(schema.shops.id, ctx.shopId));
    } catch (error: any) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  }),

  // Send text/image messages
  sendText: shopMemberProcedure
    .input(
      z.object({
        to: z.string(),
        message: z.string().optional(),
        type: z.enum(["text", "image"]).optional().default("text"),
        mediaId: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const { ctx, input } = opts;

        const shop = await ctx.db.query.shops.findFirst({
          where: eq(shops.id, ctx.shopId),
        });

        if (!shop?.whatsappPhoneNumberId && !shop?.whatsappAccessToken) {
          throw new TRPCError({
            message: "You need to update your WhatsApp first",
            code: "BAD_REQUEST",
          });
        }

        const whatsapp = await axios.post(
          `${WHATS_APP_API_URL}/${shop.whatsappPhoneNumberId}/messages`,
          {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: input.to,
            type: input.type,
            image: input.type === "image" ? { id: input.mediaId } : undefined,
            text:
              input.type === "text"
                ? {
                    preview_url: true,
                    body: input.message,
                  }
                : undefined,
          },
          {
            headers: {
              Authorization: `Bearer ${shop.whatsappAccessToken}`,
            },
          },
        );

        if (whatsapp.data) {
          return await ctx.db.transaction(
            async (tx) =>
              await tx
                .insert(schema.whatsapp)
                .values({
                  shopId: ctx.shopId,
                  sender: shop.whatsappPhoneNumberId ?? "",
                  receiver: cleanPhoneNumber(input.to),
                  message: input.message,
                  messageId: whatsapp.data.messages[0].id,
                  imageUrl: input.imageUrl,
                })
                .returning(),
          );
        }
      } catch (error: any) {
        console.error(error);
        throw new Error(error);
      }
    }),

  // Get conversation messages
  messages: shopMemberProcedure
    .input(
      z.object({
        sender: z.string(),
        receiver: z.string(),
      }),
    )
    .query(async (opts) => {
      const { ctx, input } = opts;
      const messages = await ctx.db.query.whatsapp.findMany({
        where: and(
          eq(schema.whatsapp.shopId, ctx.shopId),
          or(
            eq(schema.whatsapp.sender, input.sender),
            eq(schema.whatsapp.receiver, input.sender),
          ),
          or(
            eq(schema.whatsapp.sender, input.receiver),
            eq(schema.whatsapp.receiver, input.receiver),
          ),
        ),
        orderBy: asc(schema.whatsapp.createdAt),
      });

      return messages;
    }),

  // Template management
  syncTemplate: shopMemberProcedure.mutation(async (opts) => {
    try {
      const { ctx } = opts;
      const shop = await ctx.db.query.shops.findFirst({
        where: eq(shops.id, ctx.shopId),
      });

      // Fetch templates from master WABA
      const response = await axios.get(
        `${WHATS_APP_API_URL}/${env.WHATSAPP_WABA_ID}/message_templates`,
        {
          headers: {
            Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
          },
        },
      );

      // Get user's existing templates
      const userTemplateResponse = await axios.get(
        `${WHATS_APP_API_URL}/${shop?.whatsappWabaId}/message_templates`,
        {
          headers: {
            Authorization: `Bearer ${shop?.whatsappAccessToken}`,
          },
        },
      );

      const excludedUserTemplates = (
        userTemplateResponse.data.data as { name: string }[]
      ).map((d) => d.name);

      const templatesToRemove = [
        "hello_world",
        "how_did_we_do",
        ...excludedUserTemplates,
      ];

      const templates: MessageTemplate[] = response.data.data.filter(
        (template: any) => {
          return !templatesToRemove.includes(template.name);
        },
      );

      // Create missing templates
      for (const template of templates) {
        const {
          status: _status,
          id: _id,
          sub_category: _sub_category,
          ...createTemplate
        } = template;

        const createResponse = await axios.post(
          `${WHATS_APP_API_URL}/${shop?.whatsappWabaId}/message_templates`,
          createTemplate,
          {
            headers: {
              Authorization: `Bearer ${shop?.whatsappAccessToken}`,
            },
          },
        );

        console.log(createResponse.data);
      }
    } catch (error) {
      console.error({ error });
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }
  }),
});
```

### Webhook Handler Code

```typescript
/* apps/nextjs/src/app/api/webhook/route.ts */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { db, eq, schema } from "@carsu/db";

import { env } from "~/env.mjs";

const WEBHOOK_VERIFY_TOKEN = env.WEBHOOK_VERIFY_TOKEN;

// GET handler for webhook verification
export const GET = (req: NextRequest) => {
  const query = req.nextUrl.searchParams;
  const mode = query.get("hub.mode");
  const token = query.get("hub.verify_token");
  const challenge = query.get("hub.challenge");

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    console.log("Webhook verified successfully!");
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } else {
    return new NextResponse(null, {
      status: 403,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

// POST handler for webhook events
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log("Incoming webhook message:", JSON.stringify(body, null, 2));

  // Process incoming messages
  const message = body?.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message?.type === "text") {
    const business_phone_number_id =
      body?.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    const isExist = await db.query.whatsapp.findFirst({
      where: eq(schema.whatsapp.messageId, message.id),
    });
    
    const customer = await db.query.customers.findFirst({
      where: eq(schema.customers.phoneNumber, message.from),
    });

    // Create new customer if doesn't exist
    if (!customer) {
      await db.transaction(async (tx) => {
        const shop = await tx.query.shops.findFirst({
          where: eq(
            schema.shops.whatsappPhoneNumberId,
            business_phone_number_id,
          ),
        });

        const customer = await tx
          .insert(schema.customers)
          .values({
            phoneNumber: message.from,
            name: message.from,
          })
          .returning();

        // Link customer to shop
        if (customer[0]?.id && shop) {
          await tx.insert(schema.shopCustomers).values({
            customerId: customer[0]?.id,
            shopId: shop.id,
          });
        }
      });
    }

    // Store message and create notification
    if (!isExist && customer) {
      const shopCustomer = await db.query.shopCustomers.findFirst({
        where: eq(schema.shopCustomers.customerId, customer.id),
      });

      if (shopCustomer) {
        await db.transaction(async (tx) => {
          await tx.insert(schema.notifications).values({
            content: message.text.body,
            customerId: customer.id,
            shopId: shopCustomer?.shopId,
          });

          await tx.insert(schema.whatsapp).values({
            sender: message.from,
            receiver: business_phone_number_id,
            messageId: message.id,
            message: message.text.body,
            shopId: shopCustomer.shopId,
          });
        });
      }
    }
  }

  // Process message status updates
  const status = body?.entry?.[0]?.changes?.[0]?.value?.statuses?.[0];
  if (status?.id) {
    const isStatusIdExist = await db.query.whatsapp.findFirst({
      where: eq(schema.whatsapp.messageId, status.id),
    });

    if (isStatusIdExist) {
      await db.transaction(async (tx) => {
        await tx
          .update(schema.whatsapp)
          .set({
            read: status.status === "read",
            status: status.status,
            metadata: { error: status.errors[0] },
          })
          .where(eq(schema.whatsapp.messageId, status.id));
      });
    }
  }

  return new NextResponse(body, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
};
```

### Database Schema Code

```typescript
/* packages/db/schema/whatsapp.ts */
import { boolean, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { shops } from "./shop";
import { CREATED_AT_COLUMN, PRIMARY_KEY_COLUMN } from "./utils";

export const whatsapp = pgTable("whatsapp", {
  id: PRIMARY_KEY_COLUMN,
  messageId: text("message_id").unique(),
  sender: text("sender").notNull(),
  receiver: text("receiver").notNull(),
  message: text("message"),
  read: boolean("read").default(false),
  status: text("status"),
  shopId: uuid("shop_id")
    .references(() => shops.id)
    .notNull(),
  metadata: jsonb("metadata"),
  imageUrl: text("image_url"),
  createdAt: CREATED_AT_COLUMN,
});
```

### Frontend Settings Integration

```typescript
/* apps/nextjs/src/app/[locale]/shop/settings/page.tsx */
export default function Page() {
  // Facebook SDK initialization
  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: WHATS_APP_API_VERSION,
      });
    };

    // Load Facebook SDK
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  // WhatsApp connection mutations
  const connectWhatsApp = api.whatsapp.auth.useMutation({
    onSuccess: async () => {
      await refetchMyShop();
    },
  });

  const updateWhatsappShop = api.whatsapp.updateWhatsappShop.useMutation({
    onSuccess: async (data) => {
      if (!data.phoneNumberId) return;
      await syncTemplate.mutateAsync();
      await subscribe.mutateAsync();
      await registerWhatsapp.mutateAsync({
        phoneNumberId: data.phoneNumberId,
      });
    },
  });

  // Embedded signup event handling
  useEffect(() => {
    const handlePostMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.facebook.com") return;
      
      try {
        const data = JSON.parse(event.data as string);
        if (data.type === "WA_EMBEDDED_SIGNUP") {
          if (data.event === "FINISH") {
            const { phone_number_id, waba_id } = data.data;
            updateWhatsappShop.mutate({
              phoneNumberId: phone_number_id,
              wabaId: waba_id,
            });
          }
        }
      } catch {
        // Handle non-JSON responses
      }
    };
    
    window.addEventListener("message", handlePostMessage);
    return () => window.removeEventListener("message", handlePostMessage);
  }, []);

  // Launch WhatsApp signup flow
  const launchWhatsAppSignup = () => {
    FB.login(function (response) {
      if (response.authResponse) {
        const code = response.authResponse.code as string;
        connectWhatsApp.mutate(code);
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    }, {
      config_id: env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID,
      response_type: "code",
      override_default_response_type: true,
      scope: "business_management,whatsapp_business_management",
      extras: {
        setup: {},
        feature: "whatsapp_embedded_signup",
        version: 2,
        sessionInfoVersion: 2,
      },
    });
  };

  // UI rendering with WhatsApp connection button
  return (
    <>
      {!myShop?.whatsappAccessToken ? (
        <Button onClick={() => setIsClickToConnectModalOpen(true)}>
          {t("page.click_to_connect")}
        </Button>
      ) : (
        <Text>WhatsApp Connected</Text>
      )}
      
      <ConnectToFacebookModal
        isOpen={isClickToConnectModalOpen}
        onClose={() => setIsClickToConnectModalOpen(false)}
        launchWhatsAppSignup={launchWhatsAppSignup}
      />
    </>
  );
}
```

### Deauthorization Handlers

```typescript
/* packages/api/src/router/whatsappDeauthorize.ts */
import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

import { db, eq, schema } from "@carsu/db";

interface DeauthorizePayload {
  waba_id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Verify Meta Webhook Signature
    const metaSignature = req.headers["x-hub-signature"] as string;
    if (!metaSignature || !verifyMetaSignature(req.body, metaSignature)) {
      return res.status(403).json({ error: "Invalid signature" });
    }

    // Parse payload
    const body = req.body as DeauthorizePayload;
    const { waba_id } = body;
    if (!waba_id) {
      return res.status(400).json({ error: "Missing WABA ID in payload" });
    }

    // Find and update shop
    const shop = await db.query.shops.findFirst({
      where: eq(schema.shops.whatsappWabaId, waba_id),
    });

    if (!shop) {
      return res.status(404).json({ error: "No shop found for the WABA ID" });
    }

    // Clear WhatsApp-related fields
    await db
      .update(schema.shops)
      .set({
        whatsappPhoneNumberId: null,
        whatsappWabaId: null,
        whatsappAccessToken: null,
      })
      .where(eq(schema.shops.id, shop.id));

    console.log("Successfully deauthorized for WABA ID:", waba_id);
    return res.status(200).json({ message: "Successfully deauthorized." });
  } catch (error) {
    console.error("Error handling deauthorization:", error);
    return res.status(500).json({ error: "Failed to handle deauthorization." });
  }
}

function verifyMetaSignature(body: unknown, signature: string): boolean {
  const secret = process.env.FACEBOOK_APP_SECRET;
  if (!secret) {
    throw new Error("WhatsApp secret not configured.");
  }

  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  return `sha256=${hash}` === signature;
}
```

### Environment Variables Required

```bash
# Facebook/WhatsApp Configuration
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
NEXT_PUBLIC_FACEBOOK_CONFIG_ID=your_embedded_signup_config_id

# WhatsApp Business API
WHATSAPP_WABA_ID=your_whatsapp_business_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_system_user_access_token

# Webhook Configuration
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Application
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Key API Constants

```typescript
// packages/api/src/cache/whatsapp.ts
export const WHATS_APP_API_VERSION = "v21.0";
export const WHATS_APP_API_URL = `https://graph.facebook.com/${WHATS_APP_API_VERSION}`;
```

### Utility Functions

```typescript
// packages/api/src/services/utils.ts
export const sendWhatsAppText = async (options: {
  whatsAppUrl: string;
  to: string;
  message: string;
  whatsappAccessToken: string;
}) => {
  try {
    const { whatsAppUrl, to, message, whatsappAccessToken } = options;
    const { data } = await axios.post(
      whatsAppUrl,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          preview_url: true,
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${whatsappAccessToken}`,
        },
      },
    );
    console.log("Data: ", data);
    return data;
  } catch (error) {
    console.log("WHATS_APP_SERVER_ERROR: ", error);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `WHATS_APP_SERVER_ERROR: ${error.message}`,
    });
  }
};
```

## Environment Variables

### Required Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FACEBOOK_APP_ID` | Facebook App ID | `123456789012345` |
| `FACEBOOK_APP_SECRET` | Facebook App Secret | `abcdef123456...` |
| `NEXT_PUBLIC_FACEBOOK_CONFIG_ID` | Embedded Signup Config ID | `987654321098765` |
| `WHATSAPP_WABA_ID` | Master WhatsApp Business Account ID | `123456789012345` |
| `WHATSAPP_PHONE_NUMBER_ID` | Master Phone Number ID | `123456789012345` |
| `WHATSAPP_ACCESS_TOKEN` | System User Access Token | `EAAG...` |
| `WEBHOOK_VERIFY_TOKEN` | Webhook Verification Token | `your_secret_token` |
| `NEXT_PUBLIC_BASE_URL` | Application Base URL | `https://app.carsu.com` |

### Facebook App Setup Requirements

1. **App Type**: Business
2. **Products Added**: WhatsApp
3. **Webhook URL**: `https://your-domain.com/api/webhook`
4. **Webhook Events**: `messages`, `message_deliveries`
5. **App Review**: Required for production
6. **Business Verification**: Required for WhatsApp Business API

## Suggestions for V2 Improvements

### 1. Architecture Improvements

#### Microservices Architecture
- **Separate WhatsApp Service**: Extract WhatsApp logic into dedicated microservice
- **Message Queue**: Implement Redis/RabbitMQ for async message processing
- **Event-Driven Architecture**: Use event sourcing for message state changes

```typescript
// Proposed structure
services/
├── whatsapp-service/
│   ├── message-handler/
│   ├── template-manager/
│   ├── webhook-processor/
│   └── auth-manager/
├── notification-service/
└── customer-service/
```

#### Database Optimizations
- **Message Partitioning**: Partition messages table by shop_id and date
- **Read Replicas**: Separate read/write databases for better performance
- **Caching Layer**: Redis for frequently accessed templates and customer data

### 2. Enhanced Features

#### Advanced Message Management
```typescript
// Proposed message types
interface EnhancedMessage {
  id: string;
  type: 'text' | 'image' | 'document' | 'location' | 'contact' | 'template';
  content: MessageContent;
  metadata: {
    threadId?: string;
    tags?: string[];
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    automationId?: string;
  };
  scheduling?: {
    scheduledAt: Date;
    timezone: string;
  };
}
```

#### Conversation Threading
- **Thread Management**: Group related messages into conversations
- **Context Preservation**: Maintain conversation context across sessions
- **Auto-categorization**: AI-powered message categorization

#### Message Automation
```typescript
// Automation rules engine
interface AutomationRule {
  id: string;
  trigger: {
    type: 'keyword' | 'time' | 'event' | 'customer_action';
    condition: string;
  };
  action: {
    type: 'send_template' | 'assign_tag' | 'create_task' | 'notify_staff';
    parameters: Record<string, any>;
  };
  schedule?: CronExpression;
}
```

### 3. Performance Enhancements

#### Caching Strategy
```typescript
// Redis caching layers
const cacheStrategies = {
  templates: 'cache-aside', // 1 hour TTL
  customerData: 'write-through', // 15 minutes TTL
  messageThreads: 'write-behind', // 5 minutes TTL
  shopSettings: 'refresh-ahead', // 24 hours TTL
};
```

#### Rate Limiting
```typescript
// Rate limiting implementation
interface RateLimitConfig {
  messagesPerMinute: 100;
  templatesPerHour: 1000;
  apiCallsPerSecond: 50;
  webhookProcessingPerSecond: 200;
}
```

### 4. Monitoring & Analytics

#### Message Analytics
```typescript
interface MessageAnalytics {
  deliveryRates: {
    sent: number;
    delivered: number;
    read: number;
    failed: number;
  };
  responseMetrics: {
    averageResponseTime: number;
    firstResponseTime: number;
    resolutionTime: number;
  };
  customerSatisfaction: {
    rating: number;
    feedbackCount: number;
  };
}
```

#### Health Monitoring
- **Webhook Health**: Monitor webhook delivery success rates
- **API Latency**: Track WhatsApp API response times
- **Error Tracking**: Comprehensive error logging and alerting
- **Usage Metrics**: Track message volumes and costs

### 5. Security Enhancements

#### Enhanced Authentication
```typescript
// JWT-based webhook verification
interface WebhookPayload {
  data: any;
  signature: string;
  timestamp: number;
  nonce: string;
}

// Implement replay attack prevention
const verifyWebhookSecurity = (payload: WebhookPayload) => {
  // Verify timestamp (prevent replay attacks)
  // Verify nonce uniqueness
  // Verify signature with rotating keys
};
```

#### Data Privacy
- **Message Encryption**: Encrypt messages at rest
- **PII Handling**: Automatic PII detection and masking
- **Audit Logging**: Comprehensive audit trail for all operations
- **GDPR Compliance**: Enhanced data deletion and export capabilities

### 6. Developer Experience

#### SDK Development
```typescript
// Carsu WhatsApp SDK
class CarsuWhatsApp {
  constructor(config: WhatsAppConfig) {}
  
  async sendMessage(to: string, message: MessageBuilder): Promise<MessageResponse> {}
  async uploadMedia(file: File): Promise<MediaResponse> {}
  async getTemplates(): Promise<Template[]> {}
  async subscribeToEvents(callback: EventCallback): void {}
}
```

#### Testing Framework
```typescript
// WhatsApp integration tests
describe('WhatsApp Integration', () => {
  it('should handle incoming messages', async () => {
    const mockWebhook = createMockWebhook({
      type: 'message',
      from: '+1234567890',
      text: 'Hello'
    });
    
    const result = await processWebhook(mockWebhook);
    expect(result.status).toBe('processed');
  });
});
```

### 7. Scalability Improvements

#### Horizontal Scaling
- **Stateless Services**: Ensure all services are stateless
- **Load Balancing**: Implement proper load balancing for webhook endpoints
- **Auto-scaling**: Kubernetes-based auto-scaling based on message volume

#### Database Scaling
```sql
-- Partition messages by date and shop
CREATE TABLE whatsapp_messages_2024_01 PARTITION OF whatsapp_messages
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Index optimization
CREATE INDEX CONCURRENTLY idx_messages_shop_date 
ON whatsapp_messages (shop_id, created_at DESC);
```

### 8. Integration Enhancements

#### Multi-Channel Support
```typescript
interface ChannelConfig {
  whatsapp: WhatsAppConfig;
  sms: SMSConfig;
  email: EmailConfig;
  pushNotifications: PushConfig;
}

// Unified messaging interface
class MessageRouter {
  async sendMessage(
    recipient: string,
    content: MessageContent,
    channels: Channel[]
  ): Promise<DeliveryResult[]> {}
}
```

#### CRM Integration
- **Salesforce Integration**: Sync customer interactions
- **HubSpot Integration**: Lead management and tracking
- **Custom CRM APIs**: Flexible integration framework

### 9. Advanced Analytics

#### AI-Powered Insights
```typescript
interface MessageInsights {
  sentiment: 'positive' | 'negative' | 'neutral';
  intent: string;
  confidence: number;
  suggestedResponse?: string;
  escalationRequired?: boolean;
}

// AI service integration
class MessageAnalyzer {
  async analyzeMessage(message: string): Promise<MessageInsights> {}
  async generateResponse(context: ConversationContext): Promise<string> {}
}
```

#### Business Intelligence
- **Customer Journey Mapping**: Track customer interactions across channels
- **Conversion Analytics**: Measure message-to-appointment conversion rates
- **Staff Performance**: Analyze response times and customer satisfaction

### 10. Cost Optimization

#### Message Cost Tracking
```typescript
interface CostTracking {
  messagesSent: number;
  freeMessagesTiered: number;
  paidMessages: number;
  totalCost: number;
  projectedMonthlyCost: number;
  costPerConversion: number;
}
```

#### Template Optimization
- **Template Performance Analytics**: Track template engagement rates
- **A/B Testing**: Test different template variations
- **Automated Optimization**: ML-driven template selection

---

This comprehensive documentation provides a complete picture of the current WhatsApp integration and detailed suggestions for future improvements. The V2 recommendations focus on scalability, performance, security, and enhanced functionality while maintaining backward compatibility.
