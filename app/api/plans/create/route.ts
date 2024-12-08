import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { redis } from "@/lib/redis";
import { generatePlan } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const authResult = await auth();
  const { userId } = authResult;  if (!userId) {
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic } = await req.json();
  if (!topic) {
    return NextResponse.json({ error: "No topic provided" }, { status: 400 });
  }

  try {
    const plan = await generatePlan(topic);
    const planId = `plan:${userId}:${Date.now()}`;
    
    await redis.set(planId, JSON.stringify({ 
      topic, 
      plan, 
      expansions: {},
      userId,
      createdAt: new Date().toISOString()
    }));

    return NextResponse.json({ planId, topic, plan });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}
};
