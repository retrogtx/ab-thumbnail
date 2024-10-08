"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CreatePollForm } from "@/components/create-poll-form"
import { PollList } from "@/components/poll-list"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Loader2 } from "lucide-react"
import { AccountMenu } from "@/components/account-menu"

interface Thumbnail {
  id: string;
  url: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  thumbnails: Thumbnail[];
}

export function DashboardPageComponent() {
  const [showCreatePollForm, setShowCreatePollForm] = useState(false)
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const router = useRouter()

  const fetchPolls = useCallback(async () => {
    if (status !== "authenticated") return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/polls', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch polls');
      }

      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        title: "Error",
        description: "Failed to fetch polls. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [status, toast]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
    if (status === "authenticated") {
      fetchPolls();
    }
  }, [status, fetchPolls, router]);

  const handlePollCreated = useCallback(() => {
    setShowCreatePollForm(false);
    fetchPolls();
  }, [fetchPolls]);

  const handleCopyPollLink = useCallback((pollId: string) => {
    const pollUrl = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(pollUrl).then(() => {
      toast({
        title: "Success",
        description: "Poll link copied to clipboard!",
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast({
        title: "Error",
        description: "Failed to copy poll link. Please try again.",
        variant: "destructive",
      });
    });
  }, [toast]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // The useEffect will redirect to signin page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome, {session?.user?.name}!
          </h1>
          <div className="flex items-center space-x-4">
            <AccountMenu />
          </div>
        </header>

        <main className="space-y-8">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Create a New Poll</h2>
            {!showCreatePollForm ? (
              <Button 
                onClick={() => setShowCreatePollForm(true)}
                className="w-full sm:w-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a new poll
              </Button>
            ) : (
              <div className="overflow-x-auto">
                <CreatePollForm onCancel={() => setShowCreatePollForm(false)} onPollCreated={handlePollCreated} />
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Polls</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <PollList 
                polls={polls} 
                onPollDeleted={fetchPolls} 
                onCopyPollLink={handleCopyPollLink}
              />
            )}
          </section>
        </main>
      </div>
    </div>
  )
}