"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Plan {
  topic: string;
  plan: string[];
  expansions: Record<string, string>;
}

export default function PlanPage() {
  const { planId } = useParams();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandingPoint, setExpandingPoint] = useState<string | null>(null);

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  async function fetchPlan() {
    try {
      const res = await fetch(`/api/plans/${planId}`);
      const data = await res.json();
      setPlan(data);
    } catch (error) {
      console.error("Error fetching plan:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExpand(point: string) {
    if (expandingPoint) return;
    setExpandingPoint(point);

    try {
      const res = await fetch("/api/plans/expand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId, point }),
      });

      const data = await res.json();
      if (data.detail && plan) {
        setPlan({
          ...plan,
          expansions: {
            ...plan.expansions,
            [point]: data.detail,
          },
        });
      }
    } catch (error) {
      console.error("Error expanding point:", error);
    } finally {
      setExpandingPoint(null);
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!plan) {
    return (
      <div className="p-8">
        <p>Plan not found</p>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <Link href="/dashboard" className="text-blue-500 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">{plan.topic}</h1>
      </header>

      <div className="max-w-3xl mx-auto">
        {plan.plan.map((point, index) => (
          <div key={point} className="mb-6 p-4 bg-white rounded-lg shadow">
            <div className="flex items-start gap-4">
              <span className="font-mono text-gray-500">{index + 1}.</span>
              <div className="flex-1">
                <p className="font-medium">{point}</p>
                {plan.expansions[point] ? (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <p className="text-gray-700">{plan.expansions[point]}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleExpand(point)}
                    disabled={expandingPoint === point}
                    className="mt-2 text-sm text-blue-500 hover:underline disabled:opacity-50"
                  >
                    {expandingPoint === point ? "Expanding..." : "Expand this point"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
