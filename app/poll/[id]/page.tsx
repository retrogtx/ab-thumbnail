"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Thumbnail {
  id: string
  url: string
  votes: number
  percentage: number
}

interface PollData {
  id: string
  title: string
  description: string
  thumbnails: Thumbnail[]
  totalVotes: number
}

export default function PollPage() {
  const params = useParams()
  const id = params.id as string
  const [pollData, setPollData] = useState<PollData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voted, setVoted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      fetchPollData(id)
    }
  }, [id])

  const fetchPollData = async (pollId: string) => {
    try {
      const response = await fetch(`/api/polls/${pollId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch poll data')
      }
      const data: PollData = await response.json()
      setPollData(data)
    } catch (err) {
      setError('Error fetching poll data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const voteThumbnail = async (thumbnailId: string) => {
    if (voted) {
      toast({
        title: "Already Voted",
        description: "You have already cast your vote for this poll.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/polls/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ thumbnailId }),
      })

      if (!response.ok) {
        throw new Error('Failed to vote')
      }

      const updatedPoll = await response.json()
      setPollData(updatedPoll.poll)
      setVoted(true)
      
      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully recorded.",
      })
    } catch (error) {
      console.error('Error voting:', error)
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !pollData) {
    return <div>Error: {error || 'Failed to load poll data'}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{pollData.title}</h1>
      <p className="text-lg mb-6">{pollData.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pollData.thumbnails.map((thumbnail) => (
          <div key={thumbnail.id} className="flex flex-col items-center">
            <Image src={thumbnail.url} alt={`Thumbnail`} width={400} height={225} className="mb-4" />
            <Button 
              onClick={() => voteThumbnail(thumbnail.id)}
              disabled={voted}
              className="mb-2"
            >
              Vote for this thumbnail
            </Button>
            <p className="text-sm">
              Votes: {thumbnail.votes} ({thumbnail.percentage.toFixed(2)}%)
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center">Total votes: {pollData.totalVotes}</p>
    </div>
  )
}