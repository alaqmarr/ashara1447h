'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { MapIcon } from 'lucide-react'
import { centres } from '@/app/generated/prisma'
import { LocationBadge } from './Location'

const CentreCards = ({ centres }: { centres: any }) => {
    return (
        <div className="space-y-4">
            {centres.map((centre: centres) => (
                <Card
                    key={centre.id}
                    id={centre.id}
                    className="border-none scroll-mt-24"
                >
                    <CardHeader className="flex flex-row justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800 uppercase">
                            {centre.name}
                        </h3>
                        {centre.latitude && centre.longitude && (
                            <LocationBadge
                                centreLat={centre.latitude}
                                centreLng={centre.longitude}
                            />
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
            ))}
        </div>
    )
}

export default CentreCards