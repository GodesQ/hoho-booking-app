"use client"

import HeaderPage from '@/app/components/HeaderPage'
import Navbar from '@/app/components/Navbar'
import { Divider, Spacer, Input, Button } from '@nextui-org/react'
import React from 'react'
import Logo from '../../../public/hoho-logo.jpg';
import Image from 'next/image';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";


export default function ProfilePage() {
    return (
        <div>
            <Navbar isWithHeader={false} />
            <Spacer y={32} />
            <section className="profile-container">
                <div className="flex justify-between gap-5">
                    <div className="profile-sidebar">
                        <div className="profile-sidebar-header">
                            <Image src={Logo.src} width={100} height={100} className='rounded-full' />
                            <div className='text-center'>
                                <h3>James Garnfil</h3>
                                <h4>jamesgarnfil15@gmail.com</h4>
                            </div>

                        </div>
                        <Spacer y={5} />
                        <Divider />
                        <div className="profile-sidebar-tabs">
                            <div className="tab active">Profile</div>
                            <div className="tab">Tour Reservations</div>
                            <div className="tab">Settings</div>
                        </div>
                    </div>
                    <div className="profile-content-container">
                        <div className="tab-panel h-full">
                            <div className="tab-content h-full">
                                <div className="columns-1 sm:columns-2 space-y-3 mb-2">
                                    <Input
                                        label="Username"
                                        value=""
                                    />
                                    <Input
                                        label="Email"
                                        value=""
                                    />
                                </div>
                                <div className="columns-1 sm:columns-2 space-y-3 mb-2">
                                    <Input
                                        label="Firstname"
                                        value=""
                                    />
                                    <Input
                                        label="Lastname"
                                        value=""
                                    />
                                </div>
                                <div className="columns-1 sm:columns-1 space-y-3 mb-2">
                                    <div className="phone-number-input">
                                        <PhoneInput placeholder="Enter phone number" className="h-full" />
                                    </div>
                                </div>
                                <Button className='bg-primary text-foreground mt-3'>Save Changes</Button>
                            </div>
                            <div className="tab-content"></div>
                            <div className="tab-content"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
