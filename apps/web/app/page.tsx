import { ChallengeForm } from '@/components/challenge-form';
import { env } from '@/env';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Terminal, Timer, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const disableSubmissions = env.NEXT_PUBLIC_DISABLE_SUBMISSIONS === 'true';

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-lottie-pink/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Terminal className="w-6 h-6 text-lottie-pink" />
          Read this before starting the challenge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
            <div className="flex items-center gap-2 text-lottie-pink">
              <Timer className="w-5 h-5" />
              <h3 className="font-semibold">Time is Ticking</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Once you start, your timer begins instantly. You'll get to download a zip file
              containing a<code className="bg-muted mx-1 px-1 py-0.5 rounded">README</code>
              with your mission.
            </p>
          </div>

          <div className="space-y-4 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
            <div className="flex items-center gap-2 text-lottie-pink">
              <Trophy className="w-5 h-5" />
              <h3 className="font-semibold">Win the Prize</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete all instructions to get your final number. The fastest submission wins!
            </p>
          </div>
        </div>

        {disableSubmissions ? (
          <div className="space-y-4 text-center p-8">
            <h3 className="text-xl font-semibold text-lottie-pink">
              We are not taking any submissions at the moment
            </h3>
            <Link href="/scores">
              <Button
                variant="default"
                className="bg-lottie-pink hover:bg-lottie-pink/90 text-white"
              >
                View Leader Board
              </Button>
            </Link>
          </div>
        ) : (
          <div className="relative">
            <div className="relative">
              <ChallengeForm />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

