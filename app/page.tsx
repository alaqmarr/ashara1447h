import CentreCards from '@/components/reusable/CentreCards'
import Centres from '@/components/reusable/Centres'
import HeadingCard from '@/components/reusable/HeadingCard'
import Hero from '@/components/reusable/Hero'
import prisma from '@/lib/prisma'
import React from 'react'

const page = async () => {
  const centres = await prisma.centres.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  return (
    <div>
      <Hero />
      <HeadingCard title='CENTRES' />
      <CentreCards centres={centres} />
    </div>
  )
}

export default page
