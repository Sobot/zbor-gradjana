'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface FormData {
  name: string;
  municipality: string;
  streetName: string;
  streetNumber: string;
  latitude: number;
  longitude: number;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function RegistrationForm() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    municipality: '',
    streetName: '',
    streetNumber: '',
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const geocodeAddress = async (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google Maps API not loaded'));
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      const address = `${formData.streetName} ${formData.streetNumber}, ${formData.municipality}, Serbia`;

      geocoder.geocode({ address }, (results: any[], status: string) => {
        if (status === 'OK' && results?.[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          reject(new Error('Није могуће пронаћи адресу. Молимо проверите унете податке.'));
        }
      });
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      setError('Молимо пријавите се пре регистрације.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, geocode the address
      const { lat, lng } = await geocodeAddress();
      
      // Update form data with coordinates
      const updatedFormData = {
        ...formData,
        latitude: lat,
        longitude: lng
      };

      // Then submit the registration
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedFormData,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit registration');
      }

      alert('Успешно сте се пријавили за збор грађана!');
      setFormData({
        name: '',
        municipality: '',
        streetName: '',
        streetNumber: '',
        latitude: 0,
        longitude: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Дошло је до грешке приликом подношења пријаве.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Име и презиме
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">
            Општина
          </label>
          <input
            type="text"
            id="municipality"
            name="municipality"
            required
            value={formData.municipality}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="streetName" className="block text-sm font-medium text-gray-700">
            Улица
          </label>
          <input
            type="text"
            id="streetName"
            name="streetName"
            required
            value={formData.streetName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="streetNumber" className="block text-sm font-medium text-gray-700">
            Број
          </label>
          <input
            type="text"
            id="streetNumber"
            name="streetNumber"
            required
            value={formData.streetNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Слање...' : 'Пријави се'}
        </button>
      </div>
    </form>
  );
} 