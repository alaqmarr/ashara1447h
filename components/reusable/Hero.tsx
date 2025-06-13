import Image from 'next/image'
import React from 'react'

import { poppins } from '@/app/layout'

const Hero = () => {
    return (
        <div
            className='flex flex-col items-center h-[400px] p-4 masjidbg'
        >
            <Image
                src="/home-image.svg"
                alt="Ashara Logo"
                height={150}
                width={150}
                className='mb-4'
            />
            {/* <Image src={"/asharalogo1.png"} alt='' height={150} width={150} /> */}
            {/* <p
                className='font-[marjaan] text-4xl text-center font-bold'
            >
                عشره مبارکة ١٤٤٧ه
            </p> */}
            {/* <p
                className='text-3xl uppercase text-center font-bold font-[poppins] mt-4'
            >
                Ashara Mubaraka 1447H
            </p> */}
            <p
                className='text-2xl uppercase text-center font-bold font-[poppins] mt-2'
            >
                Secunderabad Relay Center
            </p>

        </div>
    )
}

export default Hero
