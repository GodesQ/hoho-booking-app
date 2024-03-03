import React from 'react'
import LogoText from '../../../public/hoho_text.png';
import Logo from '../../../public/hoho-logo.jpg';
import heroBackground from '../../../public/assets/bg-hero.png';
import { Button, Input } from '@nextui-org/react';
import Image from 'next/image';

const headerStyling = {
    backgroundImage: `url(${heroBackground.src})`,
}

export default function LoginPage() {
  return (
    <div className='login-main-container'>
        <div className="login-content-container">
            <div className="flex justify-center items-center flex-col text-center gap-3">
                <Image src={Logo} width={100} className='nav-logo' alt='Philippines Hop On Hop Off' />
                <h2 className='text-large' style={{ lineHeight: '35px' }}>Welcome to Philippine Hop On Hop Off Booking Tour Website</h2>
                <h3>Get Ready to Explore - Login and Dive into the Vibrant Culture of the Philippines!</h3>
            </div>
            <div className="login-form">
                <form action="#">
                    <div className="my-5">
                        <label className='text-small' htmlFor="">Email</label>
                        <Input type='email' placeholder='Type your email address...' className='mt-2' />
                    </div>
                    <div className="my-5">
                        <label className='text-small' htmlFor="">Password</label>
                        <Input type='email' placeholder='Type your password...' className='mt-2' />
                    </div>
                    <Button className='bg-primary text-foreground w-full rounded-xl shadow'>Sign In</Button>
                </form>
            </div>
        </div>
        <div className="login-image-container" style={headerStyling}>
            <Image src={LogoText} width={360} className='nav-logo' alt='Philippines Hop On Hop Off' />
            <h2 className='text-small'>Explore the Beauty of the Philippines with Ease - Login to Plan Your Adventure!
                                     Dive into a World of Stunning Landscapes, Rich Culture, and Unforgettable Experiences.</h2>
        </div>
    </div>
  )
}
