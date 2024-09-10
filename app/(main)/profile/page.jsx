"use client"

import HeaderPage from '@/app/components/HeaderPage'
import Navbar from '@/app/components/Navbar'
import { Divider, Spacer, Input, Button, Card, CardBody, Image as ClientImage } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import Logo from '../../../public/hoho-logo.jpg';
import Image from 'next/image';
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import "react-phone-number-input/style.css";
import { getSession, getUserReservations, updateProfile, updateUserSession } from '@/action'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from 'date-fns'

export default function ProfilePage() {
    const [userSession, setUserSession] = useState(null);
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        contact_no: {
            number: '',
            countryCode: '',
            isoCode: '',
        },
    });
    const [tourReservations, setTourReservations] = useState([]);
    const [activeTabIndex, setActiveTabIndex] = useState(1);

    useEffect(() => {
        getUserSession();
    }, []);

    async function getUserSession() {
        let session = await getSession();
        if (session) {
            setUserSession(session);
            setProfile(prevProfile => ({
                username: session.user.user.username,
                email: session.user.user.email,
                firstname: session.user.user.firstname,
                lastname: session.user.user.lastname,
                contact_no: {
                    number: session.user.user.contact_no,
                    countryCode: session.user.user.countryCode,
                    isoCode: session.user.user.isoCode,
                }
            }));

            await getTourReservations(session.user.token, session.user.user.id);
        }
    }

    async function getTourReservations(userToken, userId) {
        const url = `https://dashboard.philippines-hoho.ph/api/v2/tour-reservations/users/${userId}`;
        const response = await getUserReservations(url, userToken);
        setTourReservations(response.data);
    }

    const handleContactNumber = (value) => {
        if (value) {
            const parsedPhoneNumber = parsePhoneNumberFromString(value);
            const newProfile = {
                ...profile,
                contact_no: {
                    ...profile.contact_no,
                    number: parsedPhoneNumber.nationalNumber,
                    countryCode: parsedPhoneNumber.countryCallingCode,
                    isoCode: parsedPhoneNumber.country
                },
            };
            setProfile(newProfile)
        }
    }

    const handleSubmitProfile = async (e) => {
        const url = `https://dashboard.philippines-hoho.ph/api/v2/users/profile`;
        const response = await updateProfile(url, profile, userSession.user.token);

        if (response.status == 'success') {
            await updateUserSession(profile);
            toast.success(response.message);
        } else {
            toast.success(response.message);
        }
    }

    return (
        <div>
            <ToastContainer />
            <Navbar isWithHeader={false} />
            <Spacer y={32} />
            <section className="profile-container">
                <div className="flex justify-between gap-5">
                    <div className="profile-sidebar">
                        <div className="profile-sidebar-header">
                            <Image src={Logo.src} width={100} height={100} className='rounded-full' alt="Philippine HOHO Logo" />
                            <div className='text-center'>
                                <h3>James Garnfil</h3>
                                <h4>jamesgarnfil15@gmail.com</h4>
                            </div>

                        </div>
                        <Spacer y={5} />
                        <Divider />
                        <div className="profile-sidebar-tabs">
                            <div className={`tab ${activeTabIndex == 1 ? 'active' : ''}`} onClick={() => setActiveTabIndex(1)}>Profile</div>
                            <div className={`tab ${activeTabIndex == 2 ? 'active' : ''}`} onClick={() => setActiveTabIndex(2)}>Tour Reservations</div>
                            {/* <div className={`tab ${activeTabIndex == 3 ? 'active' : ''}`} onClick={() => setActiveTabIndex(3)}>Settings</div> */}
                        </div>
                    </div>
                    <div className="profile-content-container">
                        <div className="tab-panel h-full">
                            <div className={`tab-content h-full ${activeTabIndex == 1 ? 'show' : ''}`}>
                                <div className="columns-1 sm:columns-2 space-y-3 mb-2">
                                    <Input
                                        label="Username"
                                        value={profile.username}
                                        readOnly
                                    />
                                    <Input
                                        label="Email"
                                        value={profile.email}
                                        readOnly
                                    />
                                </div>
                                <div className="columns-1 sm:columns-2 space-y-3 mb-2">
                                    <Input
                                        label="Firstname"
                                        value={profile.firstname}
                                        onChange={(e) => setProfile({ ...profile, firstname: e.target.value })}
                                    />
                                    <Input
                                        label="Lastname"
                                        value={profile.lastname}
                                        onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
                                    />
                                </div>
                                <div className="columns-1 sm:columns-1 space-y-3 mb-2">
                                    <div className="phone-number-input">
                                        <PhoneInput placeholder="Enter phone number" className="h-full" value={`+${profile.contact_no.countryCode}${profile.contact_no.number}`} onChange={handleContactNumber} />
                                    </div>
                                </div>
                                <Button className='bg-primary text-foreground mt-3' onClick={handleSubmitProfile}>Save Changes</Button>
                            </div>
                            <div className={`tab-content h-full ${activeTabIndex == 2 ? 'show' : ''}`}>
                                <div className="columns-1 lg:columns-2 space-y-3">
                                    {
                                        tourReservations.map(reservation => (
                                            <Card key={reservation.id}>
                                                <CardBody>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <ClientImage src={reservation?.tour?.featured_image} width={100} height={100} alt={reservation?.tour?.name} />
                                                        <div className="flex-1 text-black">
                                                            <ul>
                                                                <li className='text-sm my-1'>
                                                                    <b>Reserved Date: </b> 
                                                                    <span>{format(reservation.start_date, 'MMM dd, yyyy')}</span>
                                                                </li>
                                                                <li className='text-sm my-1'>
                                                                    <b>Sub Amount: </b> 
                                                                    <span>{parseFloat(reservation.sub_amount).toFixed(2)}</span>
                                                                </li>
                                                                <li className='text-sm my-1'>
                                                                    <b>Additional Charges: </b> 
                                                                    <span>{parseFloat(reservation.total_additional_charges).toFixed(2)}</span>
                                                                </li>
                                                                <li className='text-sm my-1'>
                                                                    <b>Total Amount: </b> 
                                                                    <span>{parseFloat(reservation.amount).toFixed(2)}</span>
                                                                </li>
                                                            </ul>
                                                            <div className="bg-primary inline-block p-1 px-3 text-white rounded float-right mt-2">
                                                                {reservation.status}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        ))
                                    }
                                </div>
                            </div>
                            {/* <div className={`tab-content h-full ${activeTabIndex == 3 ? 'show' : ''}`}></div> */}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
