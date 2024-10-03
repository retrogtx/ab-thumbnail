import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CreatePollFormProps {
  onCancel: () => void
}

export function CreatePollForm({ onCancel }: CreatePollFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnails, setThumbnails] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement poll creation logic
    console.log('Creating poll:', { title, description, thumbnails })
    // Reset form
    setTitle('')
    setDescription('')
    setThumbnails([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setThumbnails(Array.from(e.target.files))
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
        <label htmlFor="thumbnails" className="block text-sm font-medium text-gray-700">
          Upload Thumbnails
        </label>
        <Input
          type="file"
          id="thumbnails"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          required
          className="mt-1"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Poll</Button>
      </div>
    </form>
  )
}