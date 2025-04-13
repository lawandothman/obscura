import { env } from '@/env';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return new Response('No authorization header provided', { status: 400 });
  }

  const response = await fetch(`${env.API_URL}/hack`, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(error, { status: response.status });
  }

  const result = await response.text();

  return new Response(result);
}
