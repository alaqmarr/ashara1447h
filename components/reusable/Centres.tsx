import prisma from '@/lib/prisma'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { MapIcon } from 'lucide-react'

const Centres = async () => {
    const centres = await prisma.centres.findMany({
        orderBy: {
            name: 'asc',
        },
    })
    return (
        <>
            <div>
                {
                    <ul>
                        {
                            centres.map((centre) => (
                                <li key={centre.name} className='text-lg text-center mb-2'>
                                    <a href={`#${centre.id}`} className='text-blue-500 hover:underline'>
                                        {centre.name}
                                    </a>
                                </li>
                            ))

                        }

                    </ul>
                }
                
            </div>
        </>
    )
}

export default Centres
