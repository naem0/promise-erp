import { getImageGalleryById, ImageGallery } from '@/apiServices/homePageAdminService'
import ErrorComponent from '@/components/common/ErrorComponent'
import NotFoundComponent from '@/components/common/NotFoundComponent'
import ImageGalleryForm from '@/components/web-content/image-galleries/ImageGalleryForm'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditImageGalleryPage({ params }: PageProps) {
  const { id } = await params

  const response = await getImageGalleryById(Number(id))

  if (!response?.data) {
    return <NotFoundComponent message={response.message || "No image galleries found."} />
  }

  if (!response.success) {
    return <ErrorComponent message={response.message || "Failed to load image gallery."} />
  }

  const imageGallery: ImageGallery = response?.data

  return (
    <ImageGalleryForm
      title="Edit Image Gallery"
      imageGallery={imageGallery}
    />
  )
}
