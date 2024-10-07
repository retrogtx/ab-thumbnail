"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { SignOutButton } from "@/components/sign-out"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { CreatePollForm } from "@/components/create-poll-form"
import { PollList } from "@/components/poll-list"
import { useToast } from "@/hooks/use-toast"
import { Settings } from "@/components/settings"

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

export default function DashboardPage() {
  const [showCreatePollForm, setShowCreatePollForm] = useState(false)
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()
  const { toast } = useToast()

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
      redirect("/signin");
    }
    if (status === "authenticated") {
      fetchPolls();
    }
  }, [status, fetchPolls]);

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

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {session?.user?.name}!</h1>
      {!showCreatePollForm && (
        <Button 
          onClick={() => setShowCreatePollForm(true)}
          className="mt-4"
        >
          Create a new poll
        </Button>
      )}
      {showCreatePollForm && (
        <CreatePollForm onCancel={() => setShowCreatePollForm(false)} onPollCreated={handlePollCreated} />
      )}
      {isLoading ? (
        <p>Loading polls...</p>
      ) : (
        <PollList 
          polls={polls} 
          onPollDeleted={fetchPolls} 
          onCopyPollLink={handleCopyPollLink}
        />
      )}
      <Settings />
      <div className="absolute top-4 right-4">
        <SignOutButton />
      </div>
    </div>
  )
}