"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Image, Spacer, Card, CardHeader, CardBody } from "@nextui-org/react";

export default function AttractionSlider() {
  const [attractions, setAttractions] = useState([]);

  useEffect(() => {
    fetchAttractions();
  }, []);

  async function fetchAttractions() {
    let url = `http://127.0.0.1:8000/api/v2/attractions?length=10`;
    let response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        'x-api-code': "hoho-code-hohobookingwebsite030424",
        'x-api-key': "hoho-keyhKfPeO0iGcokF7XzrTEuP1Mil030424",
      },
    });
    response = await response.json();
    setAttractions(response.data);
  }

  return (
    <Swiper spaceBetween={25} slidesPerView={4}>
      {attractions?.map((attraction) => (
        <SwiperSlide key={attraction.id}>
          <Image
            alt={attraction.name}
            className="object-cover rounded"
            src={`https://dashboard.philippines-hoho.ph/assets/img/attractions/${attraction.id}/${attraction.featured_image}`}
            width={"100%"}
            style={{
              height: "250px",
              objectFit: "cover",
              filter: "brightness(100%)",
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
