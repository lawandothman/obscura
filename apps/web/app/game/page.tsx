'use client';

import { FinalForm } from '@/components/final-form';
import { Timer } from '@/components/timer';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';

export default async function GamePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Time to play the game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              If you leave this page you may have to restart your challenge from scratch, so take
              note of the URL if you want to come back to the challenge later.
            </p>
            <p>The clock is ticking... tick tock!</p>
            <Timer />
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
