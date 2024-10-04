import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid';

interface CreatePollFormProps {
  onCancel: () => void
}

export function CreatePollForm({ onCancel }: CreatePollFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image1, setImage1] = useState<File | null>(null)
  const [image2, setImage2] = useState<File | null>(null)
  const [image1Preview, setImage1Preview] = useState<string | null>(null)
  const [image2Preview, setImage2Preview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      if (!image1 || !image2) {
        throw new Error("Please upload both images");
      }

      console.log('Uploading images...');
      const [url1, url2] = await Promise.all([
        uploadImage(image1, 1),
        uploadImage(image2, 2)
      ]);
      console.log('Image URLs:', url1, url2);

      console.log('Sending request to create poll...');
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
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API response error:', errorData);
        throw new Error(errorData.error || 'Failed to create poll');
      }

      const poll = await response.json();
      console.log('Poll created successfully:', poll);

      toast({
        title: "Success",
        description: "Poll created successfully!",
      })

      // Redirect to the new poll page
      router.push(`/poll/${poll.id}`)
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create poll. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const uploadImage = async (file: File, index: number) => {
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}-image${index}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    console.log(`Attempting to upload file: ${filePath}`);

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from('thumbnails')
      .upload(filePath, fileData, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      console.error('Error details:', error.message);
      throw error;
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('thumbnails')
      .getPublicUrl(filePath);

    if (!publicUrlData) {
      console.error('No public URL data returned');
      throw new Error('Failed to get public URL');
    }

    console.log('Public URL:', publicUrlData.publicUrl);

    return publicUrlData.publicUrl;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>, setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
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
          onChange={(e) => handleFileChange(e, setImage1, setImage1Preview)}
          accept="image/*"
          required
          className="mt-1"
        />
        {image1Preview && (
          <Image src={image1Preview} alt="Thumbnail 1 preview" width={200} height={112} className="mt-2" />
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="image2" className="block text-sm font-medium text-gray-700">
          Upload Thumbnail 2
        </label>
        <Input
          type="file"
          id="image2"
          onChange={(e) => handleFileChange(e, setImage2, setImage2Preview)}
          accept="image/*"
          required
          className="mt-1"
        />
        {image2Preview && (
          <Image src={image2Preview} alt="Thumbnail 2 preview" width={200} height={112} className="mt-2" />
        )}
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