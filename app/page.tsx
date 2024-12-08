import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Learn Planner
        </h1>
        <p className="text-center mb-8 text-lg">
          Create AI-powered learning plans for any topic
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <Link 
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Started
          </Link>
          <Link 
            href="/sign-in"
            className="text-blue-500 hover:text-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
