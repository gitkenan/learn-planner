import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { redis } from "@/lib/redis";
import { expandDetail } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const authResult = await auth();
  const { userId } = authResult;  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId, point } = await req.json();
  if (!planId || !point) {
    return NextResponse.json(
      { error: "Missing planId or point" },
      { status: 400 }
    );
  }

  try {
    const stored = await redis.get(planId);
    if (!stored) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const data = JSON.parse(stored as string);
    if (data.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const detail = await expandDetail(point);
    data.expansions[point] = detail;
    
    await redis.set(planId, JSON.stringify(data));
    return NextResponse.json({ detail });
  } catch (error) {
    console.error("Error expanding point:", error);
    return NextResponse.json(
      { error: "Failed to expand point" },
      { status: 500 }
    );
  }
}
