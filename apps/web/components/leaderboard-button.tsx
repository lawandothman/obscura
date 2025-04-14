'use client';

import { Trophy } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LeaderboardButton() {
  const pathname = usePathname();
  if (pathname === '/leaderboard') return null;

  return (
    <div className="absolute top-4 right-4 z-10">
      <Button
        variant="outline"
        className="border-lottie-pink/20 hover:bg-lottie-pink/10 cursor-pointer"
        asChild
      >
        <Link href="/leaderboard">
          <Trophy className="w-5 h-5 text-lottie-pink" />
          <span className="font-medium">Leaderboard</span>
        </Link>
      </Button>
    </div>
  );
}
