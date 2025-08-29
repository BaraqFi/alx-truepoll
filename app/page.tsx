import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
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
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          <div className="flex flex-col items-center p-6 text-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-xl font-medium">Community Driven</h3>
            <p className="text-muted-foreground">Join a community of users sharing and voting on polls about topics that matter.</p>
          </div>
          
          <div className="flex flex-col items-center p-6 text-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-6" />
              </svg>
            </div>
            <h3 className="text-xl font-medium">Real-time Results</h3>
            <p className="text-muted-foreground">Watch as votes come in and see results update in real-time with beautiful visualizations.</p>
          </div>
          
          <div className="flex flex-col items-center p-6 text-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h2" />
                <path d="M8 17h2" />
                <path d="M14 13h2" />
                <path d="M14 17h2" />
              </svg>
            </div>
            <h3 className="text-xl font-medium">Easy to Create</h3>
            <p className="text-muted-foreground">Create custom polls in seconds with our intuitive interface. No technical knowledge required.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
