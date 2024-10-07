import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

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

  const handleDeletePoll = async (pollId: string) => {
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
                <Button 
                  onClick={() => handleDeletePoll(poll.id)}
                  variant="destructive"
                  size="sm"
                >
                  Delete Poll
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}