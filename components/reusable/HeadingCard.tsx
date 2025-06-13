import Image from 'next/image'
import React from 'react'

const HeadingCard = (
    { title, arabic }: { title: string, arabic?: string }
) => {
    return (
        <div
            className='title-bg h-[100px] w-full flex items-center justify-center text-3xl text-center font-bold text-black'
        >
            <div
                className='flex items-center justify-center gap-x-8 p-4'
            >
                <Image src="/graphic.jpg" alt="" height={50} width={50} className='rounded-full' />
                <div
                    className='flex flex-col items-center justify-center gap-y-2'
                >
                    <p>{title}</p>
                    {arabic && <p className='text-lg text-gray-500 font-[marjaan]'>{arabic}</p>}
                </div>
                <Image src="/graphic.jpg" alt="" height={50} width={50} className='rounded-full' />
            </div>
        </div>
    )
}

export default HeadingCard
