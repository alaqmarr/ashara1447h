'use client'

import React, { useEffect, useState } from 'react'

type Status = 'loading' | 'active' | 'denied' | 'unsupported'

interface LocationBadgeProps {
  centreLat: number
  centreLng: number
  onDistanceChange?: (distance: number | null) => void // 👈 Added optional prop
}

export const LocationBadge: React.FC<LocationBadgeProps> = ({
  centreLat,
  centreLng,
  onDistanceChange,
}) => {
  const [distance, setDistance] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const deg2rad = (deg: number): number => deg * (Math.PI / 180)

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported')
      return
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords
      const newDistance = calculateDistance(latitude, longitude, centreLat, centreLng)

      setDistance(newDistance)
      setAccuracy(accuracy)
      setStatus('active')

      // 👉 Notify parent of distance change
      if (onDistanceChange) {
        onDistanceChange(newDistance)
      }
    }

    const handleError = (error: GeolocationPositionError) => {
      if (error.code === error.PERMISSION_DENIED) {
        setStatus('denied')
      } else {
        setStatus('loading') // Try again later
      }

      if (onDistanceChange) {
        onDistanceChange(null)
      }
    }

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      maximumAge: 15000,
      timeout: 10000
    })

    return () => navigator.geolocation.clearWatch(watchId)
  }, [centreLat, centreLng, onDistanceChange])

  const getBadgeProps = () => {
    if (status === 'active' && distance !== null) {
      let color = 'bg-green-100 text-green-800'
      if (accuracy && accuracy > 100) color = 'bg-yellow-100 text-yellow-800'
      if (accuracy && accuracy > 500) color = 'bg-red-100 text-red-800'

      return {
        text: distance < 1
          ? `${(distance * 1000).toFixed(0)}m`
          : `${distance.toFixed(1)}km`,
        className: color,
        title: accuracy
          ? `Approx. ±${Math.round(accuracy)}m accuracy`
          : 'Estimated distance'
      }
    }

    switch (status) {
      case 'denied':
        return {
          text: 'Enable location',
          className: 'bg-yellow-100 text-yellow-800',
          title: 'Grant location access to see distance'
        }
      case 'unsupported':
        return {
          text: 'GPS unsupported',
          className: 'bg-gray-100 text-gray-800',
          title: 'Your browser does not support geolocation'
        }
      case 'loading':
      default:
        return {
          text: 'Locating...',
          className: 'bg-gray-100 text-gray-800 animate-pulse',
          title: 'Determining your distance...'
        }
    }
  }

  const badge = getBadgeProps()

  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full transition-all duration-300 ${badge.className}`}
      title={badge.title}
    >
      {badge.text}
    </span>
  )
}
