import { env } from '@/env';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ submissionId: string }> },
) {
  const { submissionId } = await params;
  const response = await fetch(`${env.API_URL}/download/${submissionId}`);

  if (!response.ok) {
    return new Response('Download failed', { status: response.status });
  }

  return new Response(response.body, {
    headers: response.headers,
  });
}
