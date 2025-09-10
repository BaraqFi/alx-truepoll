'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePageContent() {
  const { user, isLoading } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          Create and Share <span className="text-primary">Polls</span> with the World
        </h1>
        <p className="text-xl text-muted-foreground">
          TruePoll makes it easy to create polls, gather opinions, and analyze results.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <Link href="/polls">Browse Polls</Link>
          </Button>
          {isLoggedIn ? (
            <Button size="lg" variant="outline" asChild>
              <Link href="/polls/create">Create Poll</Link>
            </Button>
          ) : (
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
        <div className="flex flex-col items-center p-6 text-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium">Community Driven</h3>
          <p className="text-muted-foreground">Join a community of users sharing and voting on polls about topics that matter.</p>
        </div>
        <div className="flex flex-col items-center p-6 text-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium">Real-time Results</h3>
          <p className="text-muted-foreground">Watch as votes come in and see results update in real-time with beautiful visualizations.</p>
        </div>
        <div className="flex flex-col items-center p-6 text-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium">Easy to Create</h3>
          <p className="text-muted-foreground">Create custom polls in seconds with our intuitive interface. No technical knowledge required.</p>
        </div>
      </div>
    </div>
  );
}
