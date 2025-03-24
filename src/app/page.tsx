'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Добродошли на Збор грађана</h1>
      <p className="text-xl mb-8">
        Платформа за регистрацију и организацију збора грађана у вашој општини
      </p>
      {session ? (
        <div className="space-x-4">
          <Link
            href="/register"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Региструј се за збор
          </Link>
          <Link
            href="/assembly"
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Сазови збор
          </Link>
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            href="/api/auth/signin"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Пријави се
          </Link>
        </div>
      )}
    </div>
  );
}
