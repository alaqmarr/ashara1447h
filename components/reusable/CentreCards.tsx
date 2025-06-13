'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { MapIcon, LocateFixed, LocateOff } from 'lucide-react'
import { centres } from '@/app/generated/prisma'
import { toast } from 'react-hot-toast'

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
        accuracy: number | null
        lastUpdated: Date | null
    }>({ 
        lat: null, 
        lng: null,
        accuracy: null,
        lastUpdated: null
    })
    const [isLoadingLocation, setIsLoadingLocation] = useState(false)
    const [locationError, setLocationError] = useState('')
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
    const [watchId, setWatchId] = useState<number | null>(null)

    const isGeolocationSupported = () => 'geolocation' in navigator

    const checkPermission = async () => {
        if (!isGeolocationSupported()) return
        
        try {
            const permissionStatus = await navigator.permissions.query({
                name: 'geolocation'
            })
            const granted = permissionStatus.state === 'granted'
            setPermissionGranted(granted)
            if (granted) startWatching()
            
            permissionStatus.onchange = () => {
                const newGranted = permissionStatus.state === 'granted'
                setPermissionGranted(newGranted)
                if (!newGranted) stopWatching()
                else startWatching()
            }
        } catch (error) {
            console.error('Error checking permission:', error)
        }
    }

    const startWatching = () => {
        if (!isGeolocationSupported() || watchId !== null) return

        setIsLoadingLocation(true)
        setLocationError('')

        const id = navigator.geolocation.watchPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    lastUpdated: new Date()
                })
                setPermissionGranted(true)
                setIsLoadingLocation(false)
            },
            (error) => {
                setIsLoadingLocation(false)
                setPermissionGranted(false)
                handleGeolocationError(error)
            },
            {
                enableHighAccuracy: true,
                maximumAge: 30000, // Accept cached positions no older than 30 seconds
                timeout: 10000
            }
        )
        setWatchId(id)
    }

    const stopWatching = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId)
            setWatchId(null)
        }
    }

    const handleGeolocationError = (error: GeolocationPositionError) => {
        stopWatching()
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                setLocationError('Location access denied. Please enable it in browser settings.')
                toast.error('Location tracking disabled')
                break
            case error.POSITION_UNAVAILABLE:
                setLocationError('Location information unavailable.')
                break
            case error.TIMEOUT:
                setLocationError('Location request timed out. Trying again...')
                setTimeout(startWatching, 5000)
                break
            default:
                setLocationError('Error getting location.')
        }
    }

    const requestLocationAccess = () => {
        if (permissionGranted) {
            // Force refresh if already granted
            stopWatching()
            startWatching()
            return
        }

        toast.promise(
            new Promise<void>((resolve, reject) => {
                startWatching()
                const checkInterval = setInterval(() => {
                    if (permissionGranted !== null) {
                        clearInterval(checkInterval)
                        permissionGranted ? resolve() : reject()
                    }
                }, 500)
            }),
            {
                loading: 'Requesting location access...',
                success: 'Location tracking active!',
                error: 'Location access denied'
            }
        )
    }

    useEffect(() => {
        checkPermission()
        return () => stopWatching()
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 w-full justify-between">
                    <div className="flex items-center gap-2">
                        {permissionGranted ? (
                            <>
                                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm">Location active</span>
                            </>
                        ) : (
                            <>
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <span className="text-sm">Location offline</span>
                            </>
                        )}
                    </div>
                    
                    {userLocation.lastUpdated && (
                        <span className="text-xs text-gray-500">
                            Updated: {new Date(userLocation.lastUpdated).toLocaleTimeString()}
                        </span>
                    )}
                </div>

                <Button
                    onClick={requestLocationAccess}
                    disabled={isLoadingLocation}
                    variant={permissionGranted ? "default" : "outline"}
                    className="flex items-center gap-2 w-full"
                >
                    {isLoadingLocation ? (
                        'Getting Location...'
                    ) : permissionGranted ? (
                        <>
                            <LocateFixed className="h-4 w-4" />
                            Refresh Location
                        </>
                    ) : (
                        <>
                            <LocateOff className="h-4 w-4" />
                            Enable Live Tracking
                        </>
                    )}
                </Button>

                {locationError && (
                    <div className="text-red-500 text-sm text-center w-full">
                        {locationError}
                    </div>
                )}

                {userLocation.accuracy && (
                    <div className="text-xs text-gray-500">
                        Accuracy: ±{Math.round(userLocation.accuracy)} meters
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