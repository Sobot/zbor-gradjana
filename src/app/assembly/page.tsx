import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import AssemblyForm from '@/components/AssemblyForm'

export default async function AssemblyPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Сазови збор грађана
      </h1>
      <AssemblyForm />
    </div>
  )
} 