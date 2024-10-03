"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

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

      // Refetch poll data to update the UI
      await fetchPollData(id)
    } catch (error) {
      console.error('Error voting:', error)
      // TODO: Show error message to user
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !pollData) {
    return <div>Error: {error || 'Failed to load poll data'}</div>
  }

  return (
    <div>
      <h1>{pollData.title}</h1>
      <p>{pollData.description}</p>
      <div className="thumbnail-container">
        {pollData.thumbnails.map((thumbnail) => (
          <div key={thumbnail.id} className="thumbnail">
            <Image src={thumbnail.url} alt={`Thumbnail`} width={200} height={112} />
            <button onClick={() => voteThumbnail(thumbnail.id)}>Vote for this thumbnail</button>
            <p>Votes: {thumbnail.votes} ({thumbnail.percentage.toFixed(2)}%)</p>
          </div>
        ))}
      </div>
      <p>Total votes: {pollData.totalVotes}</p>
    </div>
  )
}