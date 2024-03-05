import React from "react";
import HeaderPage from "@/app/components/HeaderPage";
import { Card, Image } from "@nextui-org/react";
import TourBookForm from "@/app/components/TourBookForm";
import TourDetailTab from "@/app/components/TourDetailTab";
import GuidedTours from "@/app/components/GuidedTours";

export async function generateStaticParams() {
  let response = await fetch(`https://dashboard.philippines-hoho.ph/api/v2/tours/guided?length=5`, {
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

async function getGuidedTour(id) {
  let response = await fetch(`https://dashboard.philippines-hoho.ph/api/v2/tours/${id}`, {
    headers: {
      "Content-Type": "application/json",
      'x-api-code': process.env.API_CODE,
      'x-api-key': process.env.API_KEY,
    },
  });
  return await response.json();
}

export default async function page({ params }) {
  let tour = await getGuidedTour(params.id);
  tour = tour.data;
  return (
    <div className="lightRed ">
      <HeaderPage title="Guided Tour" subTitle={tour?.name} />
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
        <h2 className="text-large font-semibold my-4 pl-1">Guided Tours</h2>
        <GuidedTours />
      </div>
    </div>
  );
}
