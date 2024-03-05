import React from "react";
import HeaderPage from "@/app/components/HeaderPage";
import { Card, Image } from "@nextui-org/react";
import TourBookForm from "@/app/components/TourBookForm";
import TourDetailTab from "@/app/components/TourDetailTab";
import DIYTours from "@/app/components/DIYTours";


export async function generateStaticParams() {
  let response = await fetch(`https://dashboard.philippines-hoho.ph/api/v2/tours/diy?length=5`, {
    headers: {
      "Content-Type": "application/json",
      'x-api-code': process.env.API_CODE,
      'x-api-key': process.env.API_KEY,
    },
  });

  const response_data = await response.json();
  return response_data.data.map((tour) => ({
    id: tour.id.toString(),
  }));
}

async function getDIYTour(id) {
  let response = await fetch(`https://dashboard.philippines-hoho.ph/api/v2/tours/${id}`, {
    headers: {
      "Content-Type": "application/json",
      'x-api-code': process.env.API_CODE,
      'x-api-key': process.env.API_KEY,
    },
  });
  return await response.json();
}

export default async function DIYPage({ params }) {
  let tour = await getDIYTour(params.id);
  tour = tour.data;
  return (
    <div className="lightRed ">
      <HeaderPage title="DIY Tour" subTitle={tour?.name} />
      <div className="tour-container">
        <Card className="tour-content px-5 py-5">
          <div className="flex gap-6">
            <Image
              style={{ width: "100%" }}
              width={"30%"}
              classNames={{ wrapper: "w-auto" }}
              src={`https://dashboard.philippines-hoho.ph/assets/img/tours/${tour?.id}/${tour?.featured_image}`}
              alt={tour?.name}
            />
            <div style={{ width: "70%" }}>
              <TourDetailTab tour={tour} />
            </div>
          </div>
        </Card>
        <TourBookForm tour={tour} />
      </div>
      <div className="wrapper pb-5">
        <h2 className="text-large font-semibold my-4 pl-1">DIY Tours</h2>
        <DIYTours />
      </div>
    </div>
  );
}
