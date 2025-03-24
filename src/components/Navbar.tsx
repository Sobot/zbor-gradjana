'use client';

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Збор грађана
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/register" className="text-gray-600 hover:text-gray-800">
              Прикључи се збору грађана
            </Link>
            <Link href="/assembly" className="text-gray-600 hover:text-gray-800">
              Сазови збор грађана
            </Link>
            {session ? (
              <Link
                href="/api/auth/signout"
                className="text-gray-700 hover:text-gray-900"
              >
                Одјави се
              </Link>
            ) : (
              <Link
                href="/api/auth/signin"
                className="text-gray-700 hover:text-gray-900"
              >
                Пријави се
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 