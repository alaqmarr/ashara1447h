import HelpForm from '@/components/reusable/HelpForm';
import prisma from '@/lib/prisma';
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const qrdata = await prisma.qr.findUnique({
        where: {
            id: id,
        },
        include: {
            centre: true,
        },
    });

    const teams = await prisma.team.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    if (!qrdata) {
        return <div>QR Code not found</div>;
    }
    return (
        <div>
            <HelpForm
                id={id}
                qr={qrdata}
                teams={teams}
            />
        </div>
    )
}

export default page
