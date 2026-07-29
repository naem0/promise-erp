import { getStudentById, SingleStudentResponse } from '@/apiServices/studentService'
import { BranchResponse, getBranches } from '@/apiServices/branchService'
import NotFoundComponent from '@/components/common/NotFoundComponent'
import StudentForm from '@/components/lms/students/StudentForm'
import ErrorComponent from '@/components/common/ErrorComponent'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditStudentPage({ params }: PageProps) {
  const { id } = await params


  let studentRes: SingleStudentResponse | null = null
  let branchesRes: BranchResponse | null = null

  try {
    studentRes = await getStudentById(Number(id))
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching student:', error.message)
    }
  }

  try {
    branchesRes = await getBranches({ per_page: 999 })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'digest' in error) throw error
    if (error instanceof Error) {
      console.error('Error fetching branches:', error.message)
    }else {
      console.error('Error fetching branches:', error)
    }
  }


  if (!studentRes?.data) {
    return (
      <NotFoundComponent
        message={studentRes?.message || 'Student not found.'}
      />
    )
  }
  if (!studentRes.success) {
    return (
      <ErrorComponent
        message={studentRes?.message || 'Student not found.'}
      />
    )
  }
  console.log("studentRes--->", studentRes)
  return (
    <StudentForm
      title="Edit Student"
      student={studentRes.data}
      branches={branchesRes?.data?.branches || []}
    />
  )
}