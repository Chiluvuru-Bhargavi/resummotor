export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getDailyCount, incrementDailyCount } from '@/lib/daily-counter';

export async function GET() {
  const current = getDailyCount();
  return NextResponse.json(current, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export async function POST(req: NextRequest) {
  const newCount = incrementDailyCount();
  const current = getDailyCount();
  return NextResponse.json(current, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
