import React from 'react'
import { Card, CardHeader, CardBody, Image, Spacer } from "@nextui-org/react";
import Link from 'next/link';


async function fetchDIYTours() {
    let url = `http://127.0.0.1:8000/api/v2/tours/diy`;
    let response = await fetch(url);
    return await response.json();
}


export default async function DIYTours() {
    let tours = await fetchDIYTours();
    tours = tours.data;

    return (
        <div className='flex justify-center flex-wrap gap-5'>
            {
                tours.map(tour => (
                    <Link href="#" key={tour.id}>
                        <Card className="py-4 diy-card" key={tour.id}>
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <h4 className="font-bold xl:text-medium text-black">{tour.name.length > 20 ? tour.name.substr(0, 20) + '...' : tour.name}</h4>
                                <small className="text-default-500">{tour.type}</small>
                                {/* <p className="text-small uppercase font-bold text-primary">P {parseFloat(tour.price).toFixed(2)}</p> */}
                            </CardHeader>
                            <CardBody className="overflow-visible py-2">
                                <Image
                                    alt="Card background"
                                    className="object-cover rounded-xl"
                                    src={`https://dashboard.philippines-hoho.ph/assets/img/tours/${tour.id}/${tour.featured_image}`}
                                    width={'100%'}
                                />
                            </CardBody>
                        </Card>
                    </Link>
                ))
            }
        </div>
    )
}
