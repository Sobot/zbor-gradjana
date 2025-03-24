'use client';

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface FormData {
  name: string;
  municipality: string;
  streetName: string;
  streetNumber: string;
  latitude: number;
  longitude: number;
}

export default function RegistrationForm() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    municipality: '',
    streetName: '',
    streetNumber: '',
    latitude: 0,
    longitude: 0,
  })
  const [loading, setLoading] = useState(false)

  const geocodeAddress = async () => {
    if (!formData.municipality || !formData.streetName || !formData.streetNumber) {
      alert('Молимо попуните сва поља адресе');
      return false;
    }

    try {
      const address = `${formData.streetName} ${formData.streetNumber}, ${formData.municipality}, Serbia`;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
        return true;
      } else {
        alert('Није могуће пронаћи адресу. Молимо проверите унете податке.');
        return false;
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      alert('Дошло је до грешке приликом геокодирања адресе.');
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      alert('Молимо пријавите се пре регистрације.');
      return;
    }

    setLoading(true);
    try {
      // First, geocode the address
      const geocoded = await geocodeAddress();
      if (!geocoded) {
        setLoading(false);
        return;
      }

      // Then submit the registration
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit registration');
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
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Дошло је до грешке приликом подношења пријаве.');
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
  )
} 