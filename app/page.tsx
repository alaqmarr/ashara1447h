import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import prisma from '@/lib/prisma'
import Link from 'next/link';
import React from 'react'

const page = async () => {
  const centres = await prisma.qr.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      centre: true,
    },
  });

  if (!centres || centres.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight">ERROR!</h1>
        <Separator className="my-4" />
        <p className="text-gray-500">No QR centers found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold tracking-tight">Centres</h1>
        </div>

        <Separator className="my-4" />

        {centres.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 uppercase">
            {centres.map((centre) => (
              <Card key={centre.id} className="hover:shadow-lg transition-shadow shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-center font-bold">{centre.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Center:</span>
                    <span>{centre.centre.name}</span>
                  </div>
                  <div>
                    {/* generate qr code */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent('https://helpline.ashara1447relaysec.com/' + centre.id)}&size=200x200`}
                      alt={`QR Code for ${centre.name}`}
                      className="w-32 h-32 mx-auto my-4"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button asChild variant="destructive" className="w-full">
                    <Link href={`/helpline/${centre.id}`} className='uppercase'>
                      Request Assistance
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default page