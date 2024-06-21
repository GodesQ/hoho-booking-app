"use client"

import React from 'react'
import Logo from '../../public/hoho-logo.jpg';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'

export default function ReservationNavbar() {
    const pathname = usePathname();
    return (
        <div className='reservation-navbar'>
            <div className="wrapper">
                <div className="reservation-steps-main">
                    <Link href="/">
                        <Image src={Logo} width={70} className='nav-logo' alt='Philippines Hop On Hop Off' priority />
                    </Link>
                    <ul>
                        <li className={pathname == '/cart' ? 'active' : null}>
                            <a href="#">Cart</a>
                        </li>
                        <li className={pathname == '/checkout' ? 'active' : null}>
                            <a href="#">Checkout</a>
                        </li>
                        <li className={pathname == '/confirmation' ? 'active' : null}>
                            <a href="#">Confirmation</a>
                        </li>
                    </ul>
                    <div></div>
                </div>
            </div>
        </div>
    )
}
