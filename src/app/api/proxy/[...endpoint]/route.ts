import { headers, cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { getClientConfig } from 'src/utils/runtimeConfig';
import { auth } from '@clerk/nextjs/server';

async function proxyRequest(request: NextRequest, method: string) {
  const headersList = await headers();
  const cookieStore = await cookies();

  const clerkDbJwt = cookieStore.get('__clerk_db_jwt')?.value;

  const config = getClientConfig();
  const apiUrl = config.apiUrl;

  const url = new URL(request.url);
  const endpoint = url.pathname.replace('/api/proxy/', '');
  const queryParams = url.search;

  try {
    const { getToken } = await auth();
    const token = await getToken();

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(clerkDbJwt && { Cookie: `__clerk_db_jwt=${clerkDbJwt}` }),
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const body = await request.text();
      if (body) {
        requestOptions.body = body;
      }
    }

    const response = await fetch(`${apiUrl}/${endpoint}${queryParams}`, requestOptions);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy request error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, 'PUT');
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request, 'PATCH');
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, 'DELETE');
}

export async function HEAD(request: NextRequest) {
  return proxyRequest(request, 'HEAD');
}

export async function OPTIONS(request: NextRequest) {
  return proxyRequest(request, 'OPTIONS');
}
