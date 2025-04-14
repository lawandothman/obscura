import { env } from '@/env';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { cn } from '@workspace/ui/lib/utils';
import { Crown, Medal, Timer, Trophy } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardEntry {
  id: string;
  name: string;
  start_time: number;
  end_time: number;
  score: string;
}

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${env.API_URL}/leaderboard`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  return res.json();
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
      <Card className="backdrop-blur-sm bg-card/50 border-lottie-pink/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trophy className="w-6 h-6 text-lottie-pink" />
            Leaderboard
          </CardTitle>
          <Button
            variant="outline"
            className="border-lottie-pink/20 hover:bg-lottie-pink/10 cursor-pointer"
            asChild
          >
            <Link href="/">Back to Challenge</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Top 3 winners */}
          {leaderboard.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              {/* Second place */}
              {leaderboard.length > 1 && (
                <div className="relative flex flex-col items-center justify-center p-6 rounded-lg border bg-card/60 border-silver/30 shadow-md transform md:translate-y-4">
                  <Medal className="w-12 h-12 text-silver mb-2" />
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-silver text-white text-xs font-bold px-3 py-1 rounded-full">
                    2nd Place
                  </div>
                  <h3
                    className="font-bold text-lg text-center truncate w-full max-w-[180px]"
                    title={leaderboard[1]?.name}
                  >
                    {leaderboard[1]?.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-center">
                    <Badge
                      variant="outline"
                      className="bg-silver/10 border-silver/30 text-foreground"
                    >
                      <Timer className="w-3 h-3 mr-1" /> {leaderboard[1]?.score}
                    </Badge>
                  </div>
                </div>
              )}

              {/* First place */}
              <div className="relative flex flex-col items-center justify-center p-8 rounded-lg border bg-gradient-to-b from-card/60 to-card/40 border-amber-400/30 shadow-lg transform md:-translate-y-2">
                <Crown className="w-14 h-14 text-amber-400 mb-2" />
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Winner 👑
                </div>
                <h3
                  className="font-bold text-xl text-center truncate w-full max-w-[200px]"
                  title={leaderboard[0]?.name}
                >
                  {leaderboard[0]?.name}
                </h3>
                <div className="mt-2 flex items-center justify-center">
                  <Badge className="bg-amber-500/10 border-amber-400/30 text-foreground">
                    <Timer className="w-3 h-3 mr-1" /> {leaderboard[0]?.score}
                  </Badge>
                </div>
                <div className="absolute -z-10 inset-0 bg-amber-400/5 rounded-lg animate-pulse" />
              </div>

              {/* Third place */}
              {leaderboard.length > 2 && (
                <div className="relative flex flex-col items-center justify-center p-6 rounded-lg border bg-card/60 border-bronze/30 shadow-md transform md:translate-y-6">
                  <Trophy className="w-10 h-10 text-bronze mb-2" />
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-bronze text-white text-xs font-bold px-3 py-1 rounded-full">
                    3rd Place
                  </div>
                  <h3
                    className="font-bold text-lg text-center truncate w-full max-w-[180px]"
                    title={leaderboard[2]?.name}
                  >
                    {leaderboard[2]?.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-center">
                    <Badge
                      variant="outline"
                      className="bg-bronze/10 border-bronze/30 text-foreground"
                    >
                      <Timer className="w-3 h-3 mr-1" /> {leaderboard[2]?.score}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator className="bg-lottie-pink/20 my-8" />

          {/* Full leaderboard table */}
          <div className="rounded-md border border-lottie-pink/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-lottie-pink/5">
                <TableRow>
                  <TableHead className="w-16 text-center">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                      No submissions yet. Be the first to complete the challenge!
                    </TableCell>
                  </TableRow>
                ) : (
                  leaderboard.map((entry, index) => (
                    <TableRow
                      key={entry.id}
                      className={cn(
                        'transition-colors',
                        index < 3 && 'bg-muted/30',
                        index === 0 && 'bg-amber-500/5 hover:bg-amber-500/10',
                        index === 1 && 'bg-silver/5 hover:bg-silver/10',
                        index === 2 && 'bg-bronze/5 hover:bg-bronze/10',
                      )}
                    >
                      <TableCell className="font-medium text-center">
                        {(() => {
                          if (index === 0) {
                            return (
                              <span className="inline-flex items-center justify-center rounded-full bg-amber-500/10 w-8 h-8">
                                <Crown className="w-4 h-4 text-amber-500" />
                              </span>
                            );
                          }
                          if (index === 1) {
                            return (
                              <span className="inline-flex items-center justify-center rounded-full bg-silver/10 w-8 h-8">
                                <Medal className="w-4 h-4 text-silver" />
                              </span>
                            );
                          }
                          if (index === 2) {
                            return (
                              <span className="inline-flex items-center justify-center rounded-full bg-bronze/10 w-8 h-8">
                                <Trophy className="w-4 h-4 text-bronze" />
                              </span>
                            );
                          }
                          return <span className="text-muted-foreground">{index + 1}</span>;
                        })()}
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <div className="truncate" title={entry.name}>
                          {entry.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={index < 3 ? 'default' : 'outline'}
                          className={cn(
                            'ml-auto',
                            index === 0 && 'bg-amber-500/10 text-foreground border-amber-500/30',
                            index === 1 && 'bg-silver/10 text-foreground border-silver/30',
                            index === 2 && 'bg-bronze/10 text-foreground border-bronze/30',
                          )}
                        >
                          <Timer className="w-3 h-3 mr-1" />
                          {entry.score}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
  );
}
