'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import GoogleMapsProvider from './GoogleMapsProvider';

interface FormData {
  name: string;
  municipality: string;
  streetName: string;
  streetNumber: string;
  latitude: number;
  longitude: number;
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

  const geocodeAddress = async (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      const address = `${formData.streetName} ${formData.streetNumber}, ${formData.municipality}, Serbia`;

      geocoder.geocode({ address }, (results, status) => {
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
    <GoogleMapsProvider>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Име и презиме
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
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
            value={formData.municipality}
            onChange={handleInputChange}
            required
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
            value={formData.streetName}
            onChange={handleInputChange}
            required
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
            value={formData.streetNumber}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {loading ? 'Слање...' : 'Пријави се'}
        </button>
      </form>
    </GoogleMapsProvider>
  );
} 