import { AddLocation } from '@/components/AddLocation';
import { AddCentre } from '@/components/reusable/AddCentre';
import { AddMember } from '@/components/reusable/AddMember';
import { AddTeam } from '@/components/reusable/AddTeam';
import { PrintCard } from '@/components/reusable/PrintCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import prisma from '@/lib/prisma';
import React from 'react';


const page = async () => {
    const qr = await prisma.qr.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            centre: true
        }
    })

    const teams = await prisma.team.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div
            className='w-full flex flex-col items-center justify-center p-4'
        >
            <div
                className='flex flex-row items-center justify-evenly flex-wrap'
            >
                <AddCentre />
                <AddLocation />
                <AddTeam />
                <AddMember teams={teams} />
            </div>
            <Separator className='mt-4 mb-4' />
            <div
                className='text-center'
            >
                <h1>
                    Scroll To
                </h1>
                <ul className="pl-5 mb-10 flex flex-row justify-evenly flex-wrap">
                    {qr.map((item) => (
                        <li key={item.id} className="mb-3">
                            <Button
                                variant={"outline"}
                            >
                                <a
                                    href={`#${item.id}`}
                                    className="text-lg text-blue-600 hover:underline transition-all duration-150 text-center block"
                                >
                                    {item.name}
                                </a>
                            </Button>
                        </li>
                    ))}
                </ul>
                {qr.map((item) => (
                    <div
                        id={item.id}
                    >
                        <PrintCard
                            key={item.id}
                            name={item.name}
                            centreName={item.centre.name}
                            qrId={item.id}
                        />
                    </div>
                ))}
            </div>
        </div>

    )
}

export default page
