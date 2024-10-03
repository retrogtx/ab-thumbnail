import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from '@/lib/supabase'
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface CreatePollFormProps {
  onCancel: () => void
}

export function CreatePollForm({ onCancel }: CreatePollFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image1, setImage1] = useState<File | null>(null)
  const [image2, setImage2] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!session?.user?.id) {
        throw new Error("User not authenticated")
      }

      if (!image1 || !image2) {
        throw new Error("Please upload both images")
      }
      const uploadImage = async (file: File, index: number) => {
        if (!session?.user?.id) {
          throw new Error("User not authenticated")
        }
        const fileName = `${session.user.id}/${Date.now()}-image${index}-${file.name}`
        const { error } = await supabase.storage
          .from('thumbnails')
          .upload(fileName, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(fileName)

        return publicUrl
      }

      const [url1, url2] = await Promise.all([
        uploadImage(image1, 1),
        uploadImage(image2, 2)
      ])

      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          thumbnailUrls: [url1, url2],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create poll')
      }

      toast({
        title: "Success",
        description: "Poll created successfully!",
      })

      // Reset form
      setTitle('')
      setDescription('')
      setImage1(null)
      setImage2(null)

      // TODO: Redirect to the new poll page or update UI as needed
    } catch (error) {
      console.error('Error creating poll:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create poll. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Poll Title
        </label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image1" className="block text-sm font-medium text-gray-700">
          Upload Thumbnail 1
        </label>
        <Input
          type="file"
          id="image1"
          onChange={(e) => handleFileChange(e, setImage1)}
          accept="image/*"
          required
          className="mt-1"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image2" className="block text-sm font-medium text-gray-700">
          Upload Thumbnail 2
        </label>
        <Input
          type="file"
          id="image2"
          onChange={(e) => handleFileChange(e, setImage2)}
          accept="image/*"
          required
          className="mt-1"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Poll'}
        </Button>
      </div>
    </form>
  )
}