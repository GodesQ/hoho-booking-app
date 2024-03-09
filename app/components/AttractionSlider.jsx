"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
// import { Image, Spacer, Card, CardHeader, CardBody } from "@nextui-org/react";

export default function AttractionSlider() {
    const [attractions, setAttractions] = useState([]);

    useEffect(() => {
        fetchAttractions();
    }, []);

    async function fetchAttractions() {
        let url = `https://staging.philippines-hoho.ph/api/v2/attractions?length=15`;
        let response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                'x-api-code': process.env.API_CODE,
                'x-api-key': process.env.API_KEY,
            },
        });
        response = await response.json();
        setAttractions(response.data);
    }

    return (
        <Swiper spaceBetween={20} breakpoints={{
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
            1280: {
                slidesPerView: 4,
            },
        }}>
            {attractions?.map((attraction) => (
                <SwiperSlide key={attraction.id}>
                    <Image
                        placeholder="blur"
                        blurDataURL={`https://dashboard.philippines-hoho.ph/assets/img/attractions/${attraction.id}/${attraction.featured_image}`}
                        alt={attraction.name}
                        className="object-cover w-full h-full rounded"
                        src={`https://dashboard.philippines-hoho.ph/assets/img/attractions/${attraction.id}/${attraction.featured_image}`}
                        width={350}
                        height={0}
                        title={attraction.name}
                        style={{
                            height: '250px',
                            objectFit: "cover",
                            filter: "brightness(100%)",
                        }}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
