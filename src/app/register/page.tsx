import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import RegistrationForm from '@/components/RegistrationForm'

export default async function RegisterPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Прикључи се збору грађана
      </h1>
      <RegistrationForm />
    </div>
  )
} 