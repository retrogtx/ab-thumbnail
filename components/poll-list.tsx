import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

interface PollListProps {
  polls: Poll[];
  onPollDeleted: () => void;
  onCopyPollLink: (pollId: string) => void;
}

export function PollList({ polls, onPollDeleted, onCopyPollLink }: PollListProps) {
  const { toast } = useToast()
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null)

  const handleDeletePoll = async (pollId: string) => {
    setDeletingPollId(pollId)
    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete poll')
      onPollDeleted()
      toast({
        title: "Success",
        description: "Poll deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting poll:', error)
      toast({
        title: "Error",
        description: "Failed to delete poll. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingPollId(null)
    }
  }

  return (
    <div className="w-full max-w-2xl mt-8">
      <h2 className="text-xl font-semibold mb-4">Your Polls</h2>
      {polls.length === 0 ? (
        <p>You have not created any polls yet.</p>
      ) : (
        <ul className="space-y-4">
          {polls.map((poll) => (
            <li key={poll.id} className="border p-4 rounded-md">
              <h3 className="font-semibold">{poll.title}</h3>
              <p className="text-sm text-gray-600">{poll.description}</p>
              <p className="text-sm text-gray-600">Created: {new Date(poll.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Total Votes: {poll.thumbnails.reduce((sum, t) => sum + t.votes, 0)}</p>
              <div className="mt-2 space-x-2">
                <Link href={`/poll/${poll.id}`} passHref>
                  <Button variant="outline" size="sm">
                    View Poll
                  </Button>
                </Link>
                <Button 
                  onClick={() => onCopyPollLink(poll.id)}
                  variant="outline" 
                  size="sm"
                >
                  Copy Link
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      size="sm"
                      disabled={deletingPollId === poll.id}
                    >
                      {deletingPollId === poll.id ? "Deleting poll..." : "Delete Poll"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this poll?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the poll
                        and all associated votes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeletePoll(poll.id)}>
                        Delete Poll
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}