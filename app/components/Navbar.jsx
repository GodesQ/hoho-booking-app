"use client"
import React, { useState, useEffect } from 'react';
import Logo from '../../public/hoho-logo.jpg';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { getSession } from '@/action';
import { Image } from '@nextui-org/react';

export default function Navbar() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        async function fetchSession() {
            const sessionData = await getSession();
            setSession(sessionData);
        }

        fetchSession();
    }, []);

    return (
        <nav>
            <Link href="/">
                <Image src={Logo.src} width={70} className='nav-logo' alt='Philippines Hop On Hop Off' />
            </Link>
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="#">Tours</Link></li>
                <li><Link href="https://philippines-hoho.ph/">Official Website</Link></li>
            </ul>
            <div className="flex gap-3 items-center justify-between">
                {session?.user ? (
                    <Link href='/#' className='py-2 px-4 bg-primary rounded text-foreground'>Book Now</Link>
                ) : (
                    <Link href='/login' className='py-2 px-4 bg-primary rounded text-foreground'>Login Now</Link>
                )}
                <Link href='/cart'><ShoppingCart color="white" size={20} className='cursor-pointer' /></Link>
            </div>
        </nav>
    );
}
