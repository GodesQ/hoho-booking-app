"use client"

import { Image, Spacer } from '@nextui-org/react';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'

export default function page() {
    const [tourItems, setTourItems] = useState([]);
    useEffect(() => {
        getReservationItems();
    })

    function getReservationItems() {
        let tour_items = JSON.parse(localStorage.getItem("carts")) || [];
        setTourItems(tour_items);
    }

    return (
        <div className="checkout-main-container">
            <div className="wrapper">
                <h2 className='text-large font-bold'>Checkout</h2>
                <div className="checkout-container">
                    <div className="tour-items-list">
                        {tourItems.map((tourItem, index) => (
                            <div key={index + 1} className="reservation-tour-item">
                                <Image
                                    alt={tourItem.tour.name}
                                    className="object-cover object-top rounded-xl shadow"
                                    src={`https://dashboard.philippines-hoho.ph/assets/img/tours/${tourItem.tour.id}/${tourItem.tour.featured_image}`}
                                    width={"25%"}
                                    classNames={{
                                        wrapper: "w-[25%]",
                                        img: "max-h-[200px] h-[200px] w-full",
                                    }}
                                />
                                <div className="reservation-tour-main-content">
                                    <div className="reservation-tour-content">
                                        <h2 className="text-medium font-medium mb-1.5">
                                            {tourItem.tour.name}
                                        </h2>
                                        <span className="bg-primary-50 font-semibold text-primary text-[12px] text-center my-2 p-1 px-3 rounded-2xl cursor-context-menu">
                                            {tourItem.tour.type}
                                        </span>
                                        <Spacer y={4} />
                                        <h3><small>When :</small> <span>{format(new Date(tourItem.reservation_date), 'MMMM dd, yyyy')}</span></h3>
                                        <h3><small>How Many :</small> <span>{tourItem.number_of_pax} x</span></h3>
                                        <h3><small>Total :</small> <span className="font-bold">{tourItem.total_amount?.toFixed(2)}</span></h3>
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
