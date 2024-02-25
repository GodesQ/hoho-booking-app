import React from 'react'
import Logo from '../../public/hoho-logo.jpg';
import Link from 'next/link';
import Image from 'next/image';

export default function ReservationNavbar() {
  return (
    <div className='reservation-navbar'>
        <div className="wrapper">
            <div className="reservation-steps-main">
                <Link href="/">
                    <Image src={Logo} width={70} className='nav-logo' alt='Philippines Hop On Hop Off' priority />
                </Link>
                <ul>
                    <li className='active'>
                        <a href="#">Cart</a>
                    </li> 
                    <li>
                        <a href="#">Details & Payments</a>
                    </li>
                    <li>
                        <a href="#">Confirmation</a>
                    </li>
                </ul>
                <div></div>
            </div>
        </div>
    </div>
  )
}
