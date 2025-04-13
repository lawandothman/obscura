import { FinalForm } from '@/components/final-form';
import { Timer } from '@/components/timer';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { submissionIdSchema } from '@/lib/schemas';
import { redirect } from 'next/navigation';
import { env } from '@/env';
import type { Submission } from '@/app/types/submission';

export default async function GamePage({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await params;
  const result = submissionIdSchema.safeParse(submissionId);

  if (!result.success) {
    redirect('/');
  }

  const res = await fetch(`${env.API_URL}/submissions/${submissionId}`);

  if (!res.ok) {
    redirect('/');
  }

  const submission = await res.json() as Submission;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Hello {submission.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              If you leave this page you may have to restart your challenge from scratch, so take
              note of the URL if you want to come back to the challenge later.
            </p>
            <p>The clock is ticking... tick tock!</p>
            <Timer startTime={submission.start_time} />
            <Button className="w-full" asChild>
              <a href="/download" download>
                Download .zip File
              </a>
            </Button>
            <FinalForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 