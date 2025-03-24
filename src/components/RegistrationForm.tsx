'use client';

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: 44.787197, // Belgrade's latitude
  lng: 20.457273  // Belgrade's longitude
}

interface FormData {
  name: string;
  municipality: string;
  streetName: string;
  streetNumber: string;
  location: {
    lat: number;
    lng: number;
  } | null;
}

export default function RegistrationForm() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    municipality: '',
    streetName: '',
    streetNumber: '',
    location: null,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.location) {
      alert('Молимо вас да изаберете локацију на мапи')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Грешка при регистрацији')
      }

      alert('Успешно сте се регистровали за збор грађана')
      setFormData({
        name: '',
        municipality: '',
        streetName: '',
        streetNumber: '',
        location: null,
      })
    } catch (error) {
      alert('Дошло је до грешке при регистрацији')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setFormData(prev => ({
        ...prev,
        location: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Име и презиме
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                required
                value={formData.municipality}
                onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
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
                required
                value={formData.streetName}
                onChange={(e) => setFormData(prev => ({ ...prev, streetName: e.target.value }))}
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
                required
                value={formData.streetNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, streetNumber: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="h-96">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
              <GoogleMap
                mapContainerClassName="w-full h-full rounded-lg"
                center={{ lat: 44.787197, lng: 20.457273 }}
                zoom={12}
                onClick={handleMapClick}
              >
                {formData.location && (
                  <Marker position={formData.location} />
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Регистрација у току...' : 'Региструј се'}
          </button>
        </div>
      </form>
    </div>
  )
} 