import React from 'react';
import Image from 'next/image';
import Logo from '../../public/hoho-logo.jpg';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav>
            <Link href="/">
                <Image src={Logo} width={70} className='nav-logo' alt='Philippines Hop On Hop Off' />
            </Link>
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="#">Tours</Link></li>
                <li><Link href="https://philippines-hoho.ph/">Official Website</Link></li>
            </ul>
            <div className="flex gap-3 items-center justify-between">
                <Link href='/login' className='py-2 px-4 bg-primary rounded text-foreground'>Login Now</Link>
                <Link href='/cart'><ShoppingCart color="white" size={20} className='cursor-pointer' /></Link>
            </div>

        </nav>
    )
}
