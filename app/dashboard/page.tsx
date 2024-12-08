"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleCreatePlan(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/plans/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      if (data.planId) {
        router.push(`/dashboard/${data.planId}`);
      }
    } catch (error) {
      console.error("Error creating plan:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <form onSubmit={handleCreatePlan} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            What would you like to learn?
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter a topic..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Learning Plan"}
        </button>
      </form>
    </div>
  );
}
