import React from 'react'
import { Card, CardHeader, CardBody, Image, Spacer } from "@nextui-org/react";
import Link from 'next/link';


async function fetchDIYTours() {
    let url = `https://dashboard.philippines-hoho.ph/api/v2/tours/diy`;
    let response = await fetch(url, {
        next: { revalidate: 60 },
        headers: {
            "Content-Type": "application/json",
            'x-api-code': process.env.API_CODE,
            'x-api-key': process.env.API_KEY,
        }
    });
    return await response.json();
}


export default async function DIYTours() {
    let tours = await fetchDIYTours();
    tours = tours.data ? tours.data : [];

    return (
        <div className='flex justify-center flex-wrap gap-unit-xs'>
            {
                tours.length > 0 && tours?.map(tour => (
                    <Card className=" diy-card" key={tour.id}>

                        <Link href={`/tours/diy/${tour.id}`} key={tour.id}>
                            <CardHeader className="pb-0 pt-1 px-4 flex-col items-start">
                                <h4 className="font-bold xl:text-medium text-black">{tour.name.length > 20 ? tour.name.substr(0, 20) + '...' : tour.name}</h4>
                                <small className="text-default-500">{tour.type}</small>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2">
                                <Image
                                    alt="Card background"
                                    className="object-cover rounded-xl"
                                    src={`https://dashboard.philippines-hoho.ph/assets/img/tours/${tour.id}/${tour.featured_image}`}
                                    width={'100%'}
                                />
                            </CardBody>
                        </Link>
                    </Card>

                ))
            }
        </div>
    )
}
