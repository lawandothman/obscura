import type { Submission } from '@/app/types/submission';
import {  SubmitAnswerForm } from '@/components/final-form';
import { Timer } from '@/components/timer';
import { env } from '@/env';
import { submissionIdSchema } from '@/lib/schemas';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { TimerIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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

  const submission = (await res.json()) as Submission;

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-lottie-pink/20">
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p>
            If you leave this page, you may have to restart your challenge from scratch, so take
            note of the URL if you want to come back to the challenge later.
          </p>
          <p className="flex items-center gap-2">
            <TimerIcon className="w-5 h-5 text-lottie-pink" />
            The clock is ticking... tick tock!
          </p>
          <Timer startTime={submission.start_time} endTime={submission.end_time} />
          <Button
            className="relative w-full h-16 text-xl font-semibold bg-lottie-pink hover:bg-lottie-pink/90 text-white transition-all duration-300 group flex items-center justify-center gap-3 cursor-pointer rounded-full"
            asChild
            disabled={!!submission.end_time}
          >
            <Link href={`/api/download/${submission.id}`} download>
              <div className="flex items-center justify-center gap-2">
                <span>Download .zip File</span>
                <span className="text-lottie-pink">📦</span>
              </div>
            </Link>
          </Button>
          <Separator className="bg-lottie-pink/20 my-10" />
          <SubmitAnswerForm submissionId={submission.id} />
        </div>
      </CardContent>
    </Card>
  );
}
