"use client"

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

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
      console.log('Sending vote request:', { pollId: id, thumbnailId });
      const response = await fetch(`/api/polls/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ thumbnailId }),
      })

      const responseData = await response.json()
      console.log('Vote response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to vote')
      }

      setPollData(responseData.poll)
      setVoted(true)
      
      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully recorded.",
      })
    } catch (error) {
      console.error('Error voting:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to record your vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error || !pollData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error || 'Failed to load poll data'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{pollData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{pollData.description}</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pollData.thumbnails.map((thumbnail, index) => (
          <Card key={thumbnail.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <Image 
                  src={thumbnail.url} 
                  alt={`Thumbnail ${index + 1}`} 
                  fill
                  className="object-cover"
                  priority={index < 2}
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>
              <div className="p-4">
                <Button 
                  onClick={() => voteThumbnail(thumbnail.id)}
                  disabled={voted}
                  className="w-full mb-4"
                >
                  {voted ? 'Voted' : 'Vote for this thumbnail'}
                </Button>
                <Progress value={thumbnail.percentage} className="mb-2" />
                <p className="text-sm text-center">
                  {thumbnail.votes} votes ({thumbnail.percentage.toFixed(2)}%)
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-center text-xl font-semibold">Total votes: {pollData.totalVotes}</p>
    </div>
  )
}