import { API_ENDPOINT } from "@/constant";
import { Card, CardHeader, CardBody, Image, Spacer } from "@nextui-org/react";
import Link from "next/link";

async function fetchGuidedTours() {
  let url = `https://staging.philippines-hoho.ph/api/v2/tours/guided?length=8`;
  console.log(url);
  let response = await fetch(url, {
    next: { revalidate: 60 },
    headers: {
      "Content-Type": "application/json",
      'x-api-code': process.env.API_CODE,
      'x-api-key': process.env.API_KEY,
    },
  });

  return await response.json();
}

export default async function GuidedTours() {
  let tours = await fetchGuidedTours();
  tours = tours.data ? tours.data : [];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 gap-4">
      {tours.length > 0 && tours?.map((tour) => (
        <Card className="guided-card" key={tour.id}>
          <Link href={`/tours/guided/${tour.id}`} key={tour.id}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-medium text-black">
                {tour.name.length > 20
                  ? tour.name.substr(0, 20) + "..."
                  : tour.name}
              </h4>
              <small className="text-default-500">{tour.type}</small>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src={tour.featured_image}
                width={350}
                height={0}
              />
            </CardBody>
          </Link>
        </Card>
      ))}
    </div>
  );
}
