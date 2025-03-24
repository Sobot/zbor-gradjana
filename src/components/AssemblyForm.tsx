'use client';

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { GoogleMap, DrawingManager, Marker } from '@react-google-maps/api'
import GoogleMapsProvider from './GoogleMapsProvider'

const containerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: 44.787197, // Belgrade's latitude
  lng: 20.457273  // Belgrade's longitude
}

export default function AssemblyForm() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    dateTime: '',
    location: '',
  })
  const [area, setArea] = useState<google.maps.Polygon | null>(null)
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!area || !location) return

    const areaPath = area.getPath().getArray().map(latLng => ({
      lat: latLng.lat(),
      lng: latLng.lng()
    }))

    setIsLoading(true)
    try {
      const response = await fetch('/api/assemblies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          area: {
            type: 'Polygon',
            coordinates: [areaPath.map(point => [point.lng, point.lat])],
          },
          latitude: location.lat,
          longitude: location.lng,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit assembly')
      }

      // Reset form and show success message
      setFormData({
        name: '',
        dateTime: '',
        location: '',
      })
      setArea(null)
      setLocation(null)
      alert('Успешно сте креирали збор грађана!')
    } catch (error) {
      console.error('Error:', error)
      alert('Дошло је до грешке приликом креирања збора. Молимо покушајте поново.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSelect = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Назив збора
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">
          Датум и време
        </label>
        <input
          type="datetime-local"
          id="dateTime"
          value={formData.dateTime}
          onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Локација
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <GoogleMapsProvider>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Кликните на мапу да одаберете локацију збора и користите алат за цртање да означите област
          </p>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location || center}
            zoom={location ? 15 : 10}
            onClick={handleLocationSelect}
          >
            {location && <Marker position={location} />}
            <DrawingManager
              onPolygonComplete={(polygon) => {
                if (area) {
                  area.setMap(null)
                }
                setArea(polygon)
              }}
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                },
              }}
            />
          </GoogleMap>
        </div>
      </GoogleMapsProvider>

      <button
        type="submit"
        disabled={isLoading || !area || !location}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
      >
        {isLoading ? 'Слање...' : 'Креирај збор'}
      </button>
    </form>
  )
} 