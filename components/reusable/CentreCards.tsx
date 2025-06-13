'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { MapIcon, LocateFixed } from 'lucide-react'
import { centres } from '@/app/generated/prisma'
import { toast } from 'react-hot-toast'

// Distance calculation functions remain the same
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth radius in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

const deg2rad = (deg: number) => deg * (Math.PI / 180)

const CentreCards = ({ centres }: { centres: any }) => {
    const [userLocation, setUserLocation] = useState<{
        lat: number | null
        lng: number | null
    }>({ lat: null, lng: null })
    const [isLoadingLocation, setIsLoadingLocation] = useState(false)
    const [locationError, setLocationError] = useState('')
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)

    // Check if geolocation is supported
    const isGeolocationSupported = () => {
        return 'geolocation' in navigator
    }

    // Check permission state
    const checkPermission = async () => {
        if (!isGeolocationSupported()) return
        
        try {
            const permissionStatus = await navigator.permissions.query({
                name: 'geolocation'
            })
            setPermissionGranted(permissionStatus.state === 'granted')
        } catch (error) {
            console.error('Error checking permission:', error)
        }
    }

    useEffect(() => {
        checkPermission()
    }, [])

    const getCurrentLocation = () => {
        if (!isGeolocationSupported()) {
            setLocationError('Geolocation is not supported by your browser')
            return
        }

        setIsLoadingLocation(true)
        setLocationError('')

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
                setPermissionGranted(true)
                setIsLoadingLocation(false)
                toast.success('Location access granted!')
            },
            (error) => {
                setIsLoadingLocation(false)
                setPermissionGranted(false)
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('Location access was denied. Please enable it in your browser settings.')
                        toast.error('Location access denied')
                        break
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Location information is unavailable.')
                        break
                    case error.TIMEOUT:
                        setLocationError('The request to get location timed out.')
                        break
                    default:
                        setLocationError('An unknown error occurred.')
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000, // 10 seconds
                maximumAge: 0 // Don't use cached position
            }
        )
    }

    const requestLocationAccess = () => {
        toast.promise(
            new Promise<void>((resolve, reject) => {
                getCurrentLocation()
                // We'll rely on the geolocation callbacks to resolve/reject
                // This is just for the toast UI
                const checkInterval = setInterval(() => {
                    if (permissionGranted !== null) {
                        clearInterval(checkInterval)
                        permissionGranted ? resolve() : reject()
                    }
                }, 500)
            }),
            {
                loading: 'Requesting location access...',
                success: 'Location access granted!',
                error: 'Location access denied'
            }
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 mb-4">
                {permissionGranted === false && (
                    <div className="text-red-500 text-center">
                        Location access is required to show distances.
                    </div>
                )}

                <Button
                    onClick={requestLocationAccess}
                    disabled={isLoadingLocation}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    {isLoadingLocation ? (
                        'Getting Location...'
                    ) : (
                        <>
                            <LocateFixed className="h-4 w-4" />
                            {permissionGranted ? 'Update My Location' : 'Enable Location Access'}
                        </>
                    )}
                </Button>

                {locationError && (
                    <div className="text-red-500 text-sm text-center max-w-md">
                        {locationError}
                    </div>
                )}
            </div>

            {centres.map((centre: centres) => {
                let distance = null
                if (userLocation.lat && userLocation.lng && centre.latitude && centre.longitude) {
                    distance = calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        centre.latitude,
                        centre.longitude
                    )
                }

                return (
                    <Card
                        key={centre.id}
                        id={centre.id}
                        className="border-none scroll-mt-24"
                    >
                        <CardHeader className="flex flex-row justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800 uppercase">
                                {centre.name}
                            </h3>
                            {distance !== null && (
                                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    {distance < 1 
                                        ? `${(distance * 1000).toFixed(0)} meters away` 
                                        : `${distance.toFixed(1)} km away`}
                                </span>
                            )}
                        </CardHeader>

                        <CardContent>
                            <div
                                className="mb-4 w-full h-full bg-gray-100 rounded-lg overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: centre.embed ?? '' }}
                            />
                        </CardContent>

                        {centre.mapUrl && (
                            <CardFooter>
                                <a 
                                    href={centre.mapUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full"
                                >
                                    <Button className="w-full">
                                        <MapIcon className="mr-2 h-4 w-4" />
                                        Open in Maps
                                    </Button>
                                </a>
                            </CardFooter>
                        )}
                    </Card>
                )
            })}
        </div>
    )
}

export default CentreCards