import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';

export default function GamePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Time to play the game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Once you start the challenge your timer will begin instantly and you will be able to
              download a zip file, unzip it to find a
              <code className="bg-muted ml-1 px-1 py-0.5 rounded">README</code> file.
            </p>
            <p>
              Complete all the instructions in the
              <code className="bg-muted px-1 ml-1 py-0.5 rounded">README</code> file in order to get
              your final result number. Input the number in the box and press submit. Once your
              submission is complete you will be placed in the leader board. Complete the challenge
              in the least amount of time in order to win our prize.
            </p>
            <p className="font-bold text-destructive">
              If you close the tab after starting the challenge you will have to start from scratch
              (Yes, the challenge files are different per submission)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
