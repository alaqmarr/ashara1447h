import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import Image from 'next/image'
import { Button } from './ui/button'
import { HelpCircleIcon } from 'lucide-react'

const NavBar = () => {
    return (
        <div
            className='p-2 bg2 flex items-center justify-between'
        >
            <SidebarTrigger />
            <Image
                src="/asharalogo1.png"
                alt="Ashara Logo"
                height={50}
                width={50}
                className='rounded-full'
            />
            <Button
                variant='default'
                className='bg-green-300 text-black hover:bg-gray-200 border-none'
            >
                <HelpCircleIcon />
                Helpline
            </Button>
        </div>
    )
}

export default NavBar
