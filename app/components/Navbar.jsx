"use client"
import React, { useState, useEffect } from 'react';
import Logo from '../../public/hoho-logo.jpg';
import { Menu, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { getSession } from '@/action';
import { Image } from '@nextui-org/react';

export default function Navbar() {
    const [session, setSession] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        async function fetchSession() {
            const sessionData = await getSession();
            setSession(sessionData);
        }

        fetchSession();
    }, []);

    function handleMenu() {
        if(isOpen) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }

    return (
        <nav>
            <div className="flex justify-center items-center gap-4">
                <Link href="/" className='nav-logo'>
                    <Image src={Logo.src} width={70}  alt='Philippines Hop On Hop Off' />
                </Link>
                <Menu size={25} color={'black'} className='menu-btn' onClick={handleMenu} />
            </div>

            <ul className='nav-list' style={{ top: isOpen ? '80px' : '-180px', }}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="#">Tours</Link></li>
                <li><Link href="https://philippines-hoho.ph/">Official Website</Link></li>
            </ul>
            <div className="flex gap-3 items-center justify-between nav-end-section">
                {session?.user ? (
                    <Link href='/#' className='nav-btn bg-primary rounded text-foreground'>Book Now</Link>
                ) : (
                    <Link href='/login' className='nav-btn bg-primary rounded text-foreground'>Login Now</Link>
                )}
                <Link href='/cart'><ShoppingCart size={20} className='cursor-pointer cart-icon-btn' /></Link>
            </div>
        </nav>
    );
}
